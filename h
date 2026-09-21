[1mdiff --git a/app/api/notifications/send/route.ts b/app/api/notifications/send/route.ts[m
[1mindex 8bb6315..7e4a85d 100644[m
[1m--- a/app/api/notifications/send/route.ts[m
[1m+++ b/app/api/notifications/send/route.ts[m
[36m@@ -3,14 +3,12 @@[m [mimport webpush from "web-push";[m
 import { supabaseAdmin } from "@/lib/supabaseAdmin";[m
 import { createClient } from "@/lib/supabase/server";[m
 [m
[31m-webpush.setVapidDetails([m
[32m+[m[32mexport async function POST(request: Request) {[m
[32m+[m[32m  try {webpush.setVapidDetails([m
   process.env.VAPID_EMAIL!,[m
   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,[m
   process.env.VAPID_PRIVATE_KEY![m
 );[m
[31m-[m
[31m-export async function POST(request: Request) {[m
[31m-  try {[m
     const supabase = await createClient();[m
 [m
     const {[m
