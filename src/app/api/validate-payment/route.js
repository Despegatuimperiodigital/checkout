import { WebpayPlus } from 'transbank-sdk'; 
import { NextResponse } from 'next/server';
import { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk'; 
import axios from 'axios';



const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));

export async function POST(req) { 

    try {
        const { token, orderId } = await req.json();

       const response = await tx.commit(token);

        return NextResponse.json(response);
      } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 });
      }



}