/* =============================================
   KSP Makmur Mandiri - Cloudflare Worker Proxy
   Fungsi: menyembunyikan OpenRouter API key
   dari publik, sekaligus jadi "otak" chatbot.
   ============================================= */

// Ganti dengan domain GitHub Pages kamu supaya cuma situs
// kamu yang boleh manggil proxy ini (mencegah orang lain
// numpang pakai jatah gratis kamu).
const ALLOWED_ORIGIN = "https://makmurmandiri.github.io";

const SYSTEM_PROMPT = `Kamu adalah asisten virtual resmi KSP Makmur Mandiri (Koperasi Simpan Pinjam).
Tugasmu menjawab pertanyaan calon nasabah seputar produk pinjaman koperasi dengan ramah, jelas, dan singkat.

INFORMASI RESMI YANG BOLEH KAMU PAKAI:
- Biaya admin pinjaman: 9,5% dari jumlah pinjaman (dipotong di awal).
- Jasa/bunga pinjaman: 2% flat per bulan dari pokok pinjaman.
- Simpanan wajib awal: Rp 50.000 (dipotong di awal, sekali).
- Simpanan pokok: Rp 1.000.000 (dipotong di awal, sekali, ini jadi bagian keanggotaan koperasi).
- Simpanan wajib bulanan: Rp 205.000 per bulan (dibayar tiap angsuran, di luar pokok+jasa).
- Biaya materai: Rp 22.000 (pinjaman ≤ Rp5.000.000) atau Rp 33.000 (pinjaman > Rp5.000.000).
- Cara hitung angsuran bulanan = pokok per bulan (pinjaman/tenor) + jasa (2% x pinjaman) + simpanan wajib bulanan (Rp205.000).
- Jika nasabah mau melunasi lebih cepat: sisa pokok, jasa 2% dari sisa bulan, tabungan Rp200.000 (sekali saja), dan ADM Rp5.000 per sisa bulan angsuran.
- Untuk pengajuan resmi, arahkan ke WhatsApp: https://wa.me/6281383960670

ATURAN PENTING:
- JANGAN pernah memastikan atau menjanjikan pengajuan pasti disetujui (approval bukan kewenanganmu).
- JANGAN memberi angka di luar data resmi di atas. Kalau ditanya hal yang tidak ada di data ini, jujur bilang tidak tahu dan arahkan ke WhatsApp/CS.
- Jawab dalam Bahasa Indonesia, singkat, sopan, dan gunakan format Rupiah yang jelas.
- Kalau ditanya syarat dokumen, jasa lain di luar pinjaman, atau hal di luar wewenangmu, arahkan ke WhatsApp resmi di atas.`;

export default {
  async fetch(request, env) {
    // --- Handle CORS preflight ---
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
    }

    try {
      const { message, history } = await request.json();

      if (!message || typeof message !== "string") {
        return jsonResponse({ error: "Pesan kosong." }, 400);
      }

      // Batasi riwayat chat yang dikirim biar hemat token (maks 10 pesan terakhir)
      const trimmedHistory = Array.isArray(history) ? history.slice(-10) : [];

      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...trimmedHistory,
        { role: "user", content: message }
      ];

      const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`, // disimpan sebagai secret, aman
          "Content-Type": "application/json",
          "HTTP-Referer": ALLOWED_ORIGIN,
          "X-Title": "KSP Makmur Mandiri Chatbot"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free",
          messages,
          temperature: 0.4,
          max_tokens: 500
        })
      });

      if (!orResponse.ok) {
        const errText = await orResponse.text();
        console.error("OpenRouter error:", errText);
        return jsonResponse({ error: "Gagal menghubungi layanan AI. Coba lagi sebentar lagi." }, 502);
      }

      const data = await orResponse.json();
      const reply = data?.choices?.[0]?.message?.content?.trim() || "Maaf, saya belum bisa menjawab itu sekarang.";

      return jsonResponse({ reply });

    } catch (err) {
      console.error("Worker error:", err);
      return jsonResponse({ error: "Terjadi kesalahan di server." }, 500);
    }
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() }
  });
}
