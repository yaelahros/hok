const puppeteer = require('puppeteer');
const {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  Keypair,
} = require('@solana/web3.js');
require('dotenv').config();

const DEVNET_URL = 'https://api.devnet.solana.com';
const connection = new Connection(DEVNET_URL, 'confirmed');

async function sendSol(fromKeypair, toPublicKey, amount) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toPublicKey,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
  console.log('Transaksi dikonfirmasi dengan tanda tangan:', signature);
}

async function getKeypairFromSeed(seedPhrase) {
  const bip39 = require('bip39');
  const { derivePath } = require('ed25519-hd-key');
  const seed = await bip39.mnemonicToSeed(seedPhrase);
  const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key;
  return Keypair.fromSeed(derivedSeed.slice(0, 32));
}

async function main() {
  const seedPhrase = process.env.SEED_PHRASE;
  if (!seedPhrase) {
    throw new Error('SEED_PHRASE tidak diatur dalam file .env');
  }
  const fromKeypair = await getKeypairFromSeed(seedPhrase);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigasi ke website
  await page.goto('URL_WEBSITE_ANDA');

  // Login atau hubungkan wallet jika diperlukan
  // ...

  // Fungsionalitas untuk klik tombol ring lottery
  const maxTransactions = 5;
  const amountToSend = 0.001;
  for (let i = 0; i < maxTransactions; i++) {
    try {
      // Klik tombol untuk memulai transaksi
      await page.click('SELECTOR_TOMBOL_RING_LOTTERY');
      
      // Dapatkan public key tujuan dari response website jika ada
      const toPublicKey = new PublicKey('PUBLIC_KEY_TUJUAN'); // Sesuaikan sesuai response website

      // Lakukan transaksi
      await sendSol(fromKeypair, toPublicKey, amountToSend);
      
      // Tunggu beberapa detik sebelum transaksi berikutnya
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Periksa apakah mendapatkan ring
      const ringObtained = await page.evaluate(() => {
        // Logika untuk memeriksa apakah mendapatkan ring
        // Misalnya dengan memeriksa teks atau elemen tertentu di halaman
      });
      
      if (ringObtained) {
        console.log(`Berhasil mendapatkan ring pada transaksi ke-${i + 1}`);
      } else {
        console.log(`Tidak mendapatkan ring pada transaksi ke-${i + 1}`);
      }
    } catch (error) {
      console.error(`Gagal melakukan transaksi ke-${i + 1}:`, error);
    }
  }

  await browser.close();
}

main().catch(console.error);
