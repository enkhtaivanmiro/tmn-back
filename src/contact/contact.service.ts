import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch'; 
import { CreateContactDto } from './dto/create-contact.dto';

type GoogleSheetResponse = {
  status: 'success' | 'error';
  message?: string;
};

@Injectable()
export class ContactService {
  private readonly googleSheetUrl = 'https://script.google.com/macros/s/AKfycby7Ltx1zkLZeLSmmZkiFsz9YufgT-lGUWqPWlGO4lxn1a8z_kI2aEqd0YL94nvd5EcC/exec';

  async sendToGoogleSheet(dto: CreateContactDto) {
    try {
      const res = await fetch(this.googleSheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });

      const data: GoogleSheetResponse = await res.json() as GoogleSheetResponse;

      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to submit to Google Sheet');
      }

      return { status: 'success' };
    } catch (error: any) {
      throw new HttpException(
        { status: 'error', message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
