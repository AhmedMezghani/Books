// cookie.service.ts
import { Injectable } from '@angular/core';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CookieService extends NgxCookieService{

  private encryptionKey = '8f447ccfaad990bd8b4de90f0d099fc371c8a32b874eb63ad6860ef28fff6487'; // Replace with a strong encryption key

  setEncryptedCookie(key: string, value: any, expires: number): void {
    try {

      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      const encryptedValue = CryptoJS.AES.encrypt(stringValue, this.encryptionKey).toString();
      // Log key, value, and encryptedValue to the console
      console.log('Setting encrypted cookie:', key, value, encryptedValue);

      // Attempt to set the cookie
      super.set(key, encryptedValue);
    } catch (error) {
      console.error('Error setting encrypted cookie:', error);
    }

  }


  getDecryptedCookie(key: string): any {
    try {
      const encryptedValue = super.get(key);
      if (encryptedValue) {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, this.encryptionKey);
        if (decryptedBytes.sigBytes > 0) {
          const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
          if (decryptedValue.trim() !== '') {
            return JSON.parse(decryptedValue);
          } else {
            console.error('Decryption produced an empty string.');
            return null;
          }
        } else {
          console.error('Decryption failed or produced an empty result.');
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error('Error decrypting cookie:', error);
      return null;
    }
  }

  deleteCookie(key: string): void {
    super.delete(key);
  }


  private async generateEncryptionKey(): Promise<void> {
    try {
      const key = await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256,
        },
        true,
        ['encrypt', 'decrypt']
      );

      const rawKey = await window.crypto.subtle.exportKey('raw', key);
      const buffer = new Uint8Array(rawKey);
      this.encryptionKey = this.arrayBufferToHex(buffer);
    } catch (error) {
      console.error('Error generating key:', error);
    }
  }

  private arrayBufferToHex(buffer: Uint8Array): string {
    return Array.from(buffer)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
}
