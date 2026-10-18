import {createClient} from '@supabase/supabase-js';
const AMOUNTS:Record<string,number>={wedding:26000,photography:10000,baby:9000,prewedding:18000,videography:15000,events:12000};
const LABELS:Record<string,string>={wedding:'Wedding Packages',photography:'Photography',baby:'Baby Shooting',prewedding:'Pre-Wedding Shoot',videography:'Cinematic Videography',events:'Events & Celebrations'};
export default async function handler(req:any,res:any){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 const auth=String(req.headers.authorization||'');
 const token=auth.startsWith('Bearer ')?auth.slice(7):'';
 if(!token)return res.status(401).json({error:'Sign in to send your details'});
 const url=process.env.VITE_SUPABASE_URL,anon=process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!anon)return res.status(503).json({error:'Account service is unavailable'});
 const sb=createClient(url,anon,{global:{headers:{Authorization:'Bearer '+token}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error:userError}=await sb.auth.getUser(token);
 if(userError||!user)return res.status(401).json({error:'Your session has expired'});
 const {requestId,kind}=req.body||{};
 if(typeof requestId!=='string'||!/^[0-9a-f-]{36}$/i.test(requestId)||!['quotation','payment'].includes(kind))return res.status(400).json({error:'Invalid request'});
 const [profileResult,bookingResult]=await Promise.all([
 sb.from('gcs_customer_profiles').select('full_name,phone,whatsapp_opt_in').eq('user_id',user.id).single(),
 sb.from('gcs_booking_requests').select('id,package_id,estimated_amount,payment_status').eq('id',requestId).eq('user_id',user.id).single()
 ]);
 const profile=profileResult.data,booking=bookingResult.data;
 if(!profile||!booking)return res.status(404).json({error:'Customer or quotation not found'});
 if(!profile.whatsapp_opt_in)return res.status(412).json({error:'Enable WhatsApp updates in your profile first'});
 // Do not send private quotation/payment data to unverified or impersonated phone numbers.
 if(!user.phone_confirmed_at||!user.phone||user.phone!==profile.phone)return res.status(412).json({error:'Verify this phone number in your account before receiving WhatsApp details'});
 const apiToken=process.env.META_WHATSAPP_TOKEN,phoneId=process.env.META_PHONE_NUMBER_ID;
 const template=kind==='quotation'?process.env.GCS_QUOTATION_TEMPLATE:process.env.GCS_PAYMENT_TEMPLATE;
 if(!apiToken||!phoneId||!template)return res.status(503).json({error:'Studio WhatsApp sending is not connected yet. Download the quote or contact the studio.'});
 const amount=AMOUNTS[booking.package_id];if(amount===undefined)return res.status(400).json({error:'Invalid package'});
 const textAmount='INR '+amount.toLocaleString('en-IN');
 // Templates must be approved in the business account. For payment templates, never claim a real payment occurred.
 const body={messaging_product:'whatsapp',to:profile.phone.replace('+',''),type:'template',template:{
  name:template,language:{code:'en'},components:[{type:'body',parameters:[
   {type:'text',text:profile.full_name.slice(0,100)},
   {type:'text',text:LABELS[booking.package_id]},
   {type:'text',text:textAmount}
  ]}]}
 }};
 try{
 const response=await fetch('https://graph.facebook.com/v23.0/'+encodeURIComponent(phoneId)+'/messages',{method:'POST',headers:{Authorization:'Bearer '+apiToken,'Content-Type':'application/json'},body:JSON.stringify(body)});
 if(!response.ok){return res.status(502).json({error:'Business WhatsApp provider did not accept the message. Please try contacting the studio.'});}
 const result=await response.json();
 if(!result.messages?.[0]?.id)return res.status(502).json({error:'WhatsApp delivery could not be confirmed'});
 return res.status(200).json({status:'accepted',message:'Message accepted by WhatsApp. Delivery may take time.'});
 }catch{return res.status(502).json({error:'Unable to connect to the WhatsApp provider right now'});}
}
