import {readFileSync, writeFileSync, readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const head = `<!-- HLPB_TRACKING_HEAD_START -->
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-575FXVC9');</script>
<!-- End Google Tag Manager -->
<!-- Meta Pixel Code: managed here; do not also fire this Pixel through GTM. -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1649133696716796');
fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->
<!-- HLPB_TRACKING_HEAD_END -->`;
const body = `<!-- HLPB_TRACKING_BODY_START -->
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-575FXVC9"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<noscript><img height="1" width="1" style="display:none" alt=""
src="https://www.facebook.com/tr?id=1649133696716796&amp;ev=PageView&amp;noscript=1"></noscript>
<!-- HLPB_TRACKING_BODY_END -->`;

export function addTracking(html) {
  if (!/<head\b/i.test(html) || !/<body\b/i.test(html)) throw Error('Expected a complete HTML page');
  let clean = html.replace(/\n?<!-- HLPB_TRACKING_HEAD_START -->[\s\S]*?<!-- HLPB_TRACKING_HEAD_END -->\s*/g, '')
    .replace(/\n?<!-- HLPB_TRACKING_BODY_START -->[\s\S]*?<!-- HLPB_TRACKING_BODY_END -->\s*/g, '');
  if (/fbq\s*\(|googletagmanager\.com\/(?:gtm\.js|ns\.html)/i.test(clean)) throw Error('Unmanaged tracking found; review before replacing');
  return clean.replace(/<head\b[^>]*>/i, '$&\n'+head+'\n').replace(/<body\b[^>]*>/i, '$&\n'+body+'\n');
}

export function installTracking(root = '.') {
  let count = 0;
  for (const dir of ['', 'articles', 'news', 'events']) {
    for (const entry of readdirSync(resolve(root, dir), {withFileTypes:true})) {
      if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
      const path = resolve(root, dir, entry.name);
      const original = readFileSync(path, 'utf8');
      if (!/<head\b/i.test(original) || !/<body\b/i.test(original)) continue;
      const updated = addTracking(original);
      if (updated !== original) {writeFileSync(path, updated); count++;}
    }
  }
  return count;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Tracking installed on ${installTracking()} pages`);
}
