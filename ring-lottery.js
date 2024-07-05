const { chromium } = require('playwright');
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

const DEVNET_URL = 'https://devnet.sonic.game/';
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

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigasi ke website
  await page.goto('https://odyssey.sonic.game/task/ring-lottery');

  // Login atau hubungkan wallet jika diperlukan
  // ...

  // Fungsionalitas untuk klik tombol ring lottery
  const maxTransactions = 1;
  const amountToSend = 0.001;
  for (let i = 0; i < maxTransactions; i++) {
    try {
      // Klik tombol untuk memulai transaksi
      await page.click('SELECTOR_TOMBOL_RING_LOTTERY');
      
      // Tunggu beberapa saat hingga elemen dengan public key tujuan tersedia
      await page.waitForSelector('SELECTOR_ELEMEN_YANG_MENGANDUNG_PUBLIC_KEY');

      // Dapatkan public key tujuan dari halaman
      const toPublicKeyString = await page.evaluate(() => {
        // Ganti dengan selector yang benar
        return document.querySelector('SELECTOR_ELEMEN_YANG_MENGANDUNG_PUBLIC_KEY').innerText;
      });
      const toPublicKey = new PublicKey(toPublicKeyString);

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
