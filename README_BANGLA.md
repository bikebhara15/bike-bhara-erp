# Bike Bhara ERP — GitHub + Vercel + Supabase

## এই Project-এ আছে
- Supabase email/password Login
- Dashboard
- Registration ও Tax Token expiry alert
- Bike management
- Customer management
- Advance booking এবং booking conflict check
- Rental এবং return
- Income/expense summary
- Bike Bhara logo ও business contact

## ধাপ ১ — Supabase Database

1. Supabase Dashboard-এ আপনার project খুলুন।
2. বাম পাশ থেকে **SQL Editor** খুলুন।
3. **New query** চাপুন।
4. এই project-এর `supabase/schema.sql` ফাইল খুলে সম্পূর্ণ code Copy করুন।
5. SQL Editor-এ Paste করে **Run** চাপুন।

## ধাপ ২ — Owner Login তৈরি

1. Supabase → **Authentication → Users**
2. **Add user → Create new user**
3. Email দিন: `BikeBhara15@gmail.com`
4. নিজের একটি শক্ত password দিন।
5. Auto Confirm User চালু রাখুন।
6. Password কাউকে পাঠাবেন না।

## ধাপ ৩ — Supabase Key

Supabase project-এর **Connect** panel থেকে সংগ্রহ করুন:
- Project URL
- Publishable key

বর্তমান Supabase setup-এ environment variable-এর নাম:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## ধাপ ৪ — GitHub-এ Upload

1. GitHub → **New repository**
2. নাম: `bike-bhara-erp`
3. Private বা Public নির্বাচন করুন।
4. ZIP Extract করুন।
5. Repository-তে **Add file → Upload files**
6. ZIP-এর ভেতরের সব file/folder একসঙ্গে upload করুন।
7. **Commit changes** চাপুন।

নোট: ZIP ফাইলটি নিজে upload করবেন না; ZIP Extract করে ভেতরের file/folder upload করবেন।

## ধাপ ৫ — Vercel Deploy

1. Vercel Dashboard → **Add New → Project**
2. GitHub-এর `bike-bhara-erp` repository নির্বাচন করুন।
3. **Import** চাপুন।
4. Framework হিসেবে Next.js নিজে থেকে শনাক্ত হবে।
5. Environment Variables-এ যোগ করুন:

   `NEXT_PUBLIC_SUPABASE_URL` = আপনার Supabase Project URL

   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = আপনার Supabase Publishable Key

6. দুটো variable Production, Preview ও Development-এ রাখুন।
7. **Deploy** চাপুন।

Deploy সফল হলে Vercel একটি link দেবে:
`https://bike-bhara-erp-....vercel.app`

## Login

Supabase Authentication-এ তৈরি করা:
- Email: BikeBhara15@gmail.com
- Password: আপনি যেটা দিয়েছেন

## নিরাপত্তা

- `.env.local` বা secret key GitHub-এ upload করবেন না।
- Service Role Key কখনো browser app বা Vercel public variable-এ ব্যবহার করবেন না।
- শুধু Publishable key ব্যবহার করবেন।
