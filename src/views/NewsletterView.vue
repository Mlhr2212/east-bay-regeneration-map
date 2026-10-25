<template>
  <div class="min-h-screen bg-regen-paper font-inter text-regen-ink">
    <PageHeader :back="{ to: '/regeneration', label: 'Back to the map' }" eyebrow="Guild volunteer view" title="Newsletter" width="900px" />

    <div class="mx-auto max-w-[900px] px-6 py-8">
      <!-- Send mode (brief §4c — always say which mode) -->
      <p class="mt-3 flex items-start gap-2 rounded-xl border border-regen-warning/30 bg-regen-warning/5 px-4 py-3 font-inter text-[13px] leading-relaxed text-regen-ink-soft">
        <i class="fa-solid fa-circle-info mt-0.5 text-regen-warning" aria-hidden="true"></i>
        <span><strong>Send mode: Demo.</strong> No email provider is configured in this build, so “Send” records the newsletter as <em>Sent (demo)</em> with today's date and the recipient count, and offers the rendered HTML for manual sending. It never emails anyone. Wiring the backend's Resend integration would make this a real send. Only opted-in subscribers ({{ newsletter.subscriberCount }}) are ever counted.</span>
      </p>

      <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <!-- Compose -->
        <section>
          <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">{{ editingId ? 'Edit draft' : 'Compose' }}</h2>
          <div class="mt-2 space-y-4">
            <div>
              <label :class="labelCls" for="nl-subject">Subject <span class="text-regen-danger">*</span></label>
              <input id="nl-subject" v-model.trim="subject" :class="inputCls" placeholder="What's this issue about?" />
              <p v-if="err.subject" :class="errCls">{{ err.subject }}</p>
            </div>
            <div>
              <label :class="labelCls" for="nl-body">Body <span class="text-regen-danger">*</span></label>
              <textarea id="nl-body" v-model.trim="body" rows="7" :class="inputCls" placeholder="Write your update…"></textarea>
              <p v-if="err.body" :class="errCls">{{ err.body }}</p>
            </div>
            <div>
              <label :class="labelCls">Feature listings from the map</label>
              <div class="max-h-40 overflow-y-auto rounded-xl border border-regen-line bg-regen-surface p-2">
                <label v-for="r in resources.resources" :key="r.slug" class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 font-inter text-sm hover:bg-regen-paper">
                  <input type="checkbox" :value="r.slug" v-model="featured" class="h-4 w-4 rounded border-regen-line text-regen-moss focus:ring-regen-moss" />
                  {{ r.name }} <span class="text-regen-muted">· {{ r.neighbourhood }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <button type="button" class="rounded-xl border border-regen-line bg-regen-surface px-4 py-2.5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-moss" @click="onSaveDraft">Save draft</button>
            <button type="button" class="rounded-xl border border-regen-line bg-regen-surface px-4 py-2.5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-moss" @click="showPreview = !showPreview">{{ showPreview ? 'Hide preview' : 'Preview' }}</button>
            <button type="button" class="rounded-xl bg-regen-moss px-4 py-2.5 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark" @click="askSend">
              <i class="fa-solid fa-paper-plane mr-1.5" aria-hidden="true"></i> Send…
            </button>
          </div>

          <!-- Send confirm -->
          <div v-if="confirming" class="mt-4 rounded-2xl border border-regen-moss/40 bg-regen-moss/5 p-4">
            <p class="font-inter text-sm text-regen-ink">Send “<strong>{{ subject }}</strong>” to <strong>{{ newsletter.subscriberCount }}</strong> subscribers?</p>
            <p class="mt-1 font-inter text-[13px] text-regen-muted">Demo mode — this records the send and exports the HTML; no email goes out.</p>
            <div class="mt-3 flex gap-2">
              <button type="button" class="rounded-xl bg-regen-moss px-4 py-2.5 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark" @click="confirmSend">Confirm send (demo)</button>
              <button type="button" class="rounded-xl border border-regen-line px-4 py-2.5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-moss" @click="confirming = false">Cancel</button>
            </div>
          </div>

          <!-- Preview -->
          <div v-if="showPreview" class="mt-5">
            <p class="mb-2 font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Preview — as a subscriber sees it</p>
            <div class="overflow-hidden rounded-2xl border border-regen-line bg-white">
              <div class="bg-regen-moss px-5 py-4">
                <p class="font-fraunces text-[18px] font-600 text-white">East Bay Regeneration Map</p>
              </div>
              <div class="px-5 py-5 text-[#1C2A21]">
                <h3 class="font-fraunces text-[22px] font-600">{{ subject || 'Subject line' }}</h3>
                <p class="mt-2 whitespace-pre-line font-inter text-[15px] leading-relaxed">{{ body || 'Your message will appear here.' }}</p>
                <div v-if="featuredResources.length" class="mt-4 space-y-2">
                  <p class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6B7A6F]">Featured on the map</p>
                  <div v-for="r in featuredResources" :key="r.slug" class="rounded-xl border border-[#E5DDD0] p-3">
                    <p class="font-fraunces text-[15px] font-600">{{ r.name }}</p>
                    <p class="font-inter text-[13px] text-[#4A5A50]">{{ r.neighbourhood }}{{ r.city ? ', ' + r.city : '' }} — {{ r.shortDescription || r.description }}</p>
                  </div>
                </div>
                <p class="mt-5 border-t border-[#E5DDD0] pt-3 font-inter text-[12px] text-[#6B7A6F]">
                  You're receiving this because you opted in. <a href="#" class="text-[#2D5A3D] underline">Unsubscribe</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Sidebar: history + subscribers + unsubscribe demo -->
        <aside class="space-y-5">
          <div>
            <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">History</h2>
            <ul class="mt-2 space-y-2">
              <li v-for="n in newsletter.newsletters" :key="n.id" class="rounded-xl border border-regen-line bg-regen-surface p-3">
                <div class="flex items-start justify-between gap-2">
                  <p class="font-inter text-sm font-semibold text-regen-ink">{{ n.subject }}</p>
                  <span class="shrink-0 rounded-full px-2 py-0.5 font-inter text-xs font-semibold" :class="n.status === 'sent' ? 'bg-regen-success/10 text-regen-success' : 'bg-regen-warning/10 text-regen-warning'">{{ n.status === 'sent' ? 'Sent' : 'Draft' }}</span>
                </div>
                <p class="mt-1 font-inter text-xs text-regen-muted">
                  <span v-if="n.status === 'sent'">{{ n.sentAt }} · {{ n.recipientCount }} recipients</span>
                  <span v-else>Not sent yet</span>
                </p>
                <div class="mt-2 flex gap-3">
                  <button type="button" class="font-inter text-xs font-semibold text-regen-moss hover:underline" @click="load(n)">{{ n.status === 'draft' ? 'Edit' : 'Open' }}</button>
                  <button type="button" class="font-inter text-xs font-semibold text-regen-muted hover:text-regen-ink" @click="exportHtml(n)">Export HTML</button>
                </div>
              </li>
            </ul>
          </div>

          <div class="rounded-xl border border-regen-line bg-regen-surface p-4">
            <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Subscribers</h2>
            <p class="mt-1 font-inter text-sm text-regen-ink-soft">{{ newsletter.subscriberCount }} opted in. Emails are private — never shown publicly.</p>
            <div class="mt-3">
              <label :class="labelCls" for="nl-unsub">Unsubscribe an address (demo)</label>
              <div class="flex gap-2">
                <input id="nl-unsub" v-model.trim="unsubEmail" type="email" :class="inputCls" placeholder="email to remove" />
                <button type="button" class="shrink-0 rounded-xl border border-regen-line px-3 font-inter text-sm font-semibold text-regen-ink hover:border-regen-danger" @click="doUnsub">Remove</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTitle } from '@vueuse/core';
import { useNewsletterStore, useResourcesStore, useAlertStore } from '@/stores';
import PageHeader from '@/components/PageHeader.vue';

const newsletter = useNewsletterStore();
const resources = useResourcesStore();
const alert = useAlertStore();

const labelCls = 'mb-1.5 block font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted';
const inputCls = 'w-full rounded-xl border border-regen-line bg-regen-paper px-4 py-2.5 font-inter text-[15px] text-regen-ink outline-none focus:border-regen-moss focus:ring-2 focus:ring-regen-moss/30';
const errCls = 'mt-1.5 font-inter text-[13px] font-semibold text-regen-danger';

const editingId = ref(null);
const subject = ref('');
const body = ref('');
const featured = ref([]);
const showPreview = ref(false);
const confirming = ref(false);
const unsubEmail = ref('');
const err = ref({});

const featuredResources = computed(() => featured.value.map((s) => resources.bySlug(s)).filter(Boolean));

function validate() {
  err.value = {};
  if (!subject.value) err.value.subject = 'Add a subject.';
  if (!body.value) err.value.body = 'Add a message.';
  return !Object.keys(err.value).length;
}
function onSaveDraft() {
  if (!validate()) return;
  editingId.value = newsletter.saveDraft({ id: editingId.value, subject: subject.value, body: body.value, featured: [...featured.value] });
  alert.success('Draft saved.');
}
function askSend() {
  if (!validate()) return;
  if (!editingId.value) editingId.value = newsletter.saveDraft({ subject: subject.value, body: body.value, featured: [...featured.value] });
  else newsletter.saveDraft({ id: editingId.value, subject: subject.value, body: body.value, featured: [...featured.value] });
  confirming.value = true;
}
function confirmSend() {
  const res = newsletter.send(editingId.value);
  confirming.value = false;
  alert.success(`Sent (demo) to ${res.recipientCount} subscribers. Export the HTML to send manually.`);
}
function load(n) {
  editingId.value = n.id;
  subject.value = n.subject;
  body.value = n.body;
  featured.value = [...(n.featured || [])];
  showPreview.value = true;
}
function doUnsub() {
  if (newsletter.unsubscribe(unsubEmail.value)) alert.success(`${unsubEmail.value} unsubscribed.`);
  else alert.error('That address is not on the list.');
  unsubEmail.value = '';
}

// Build a standalone HTML email for manual sending (brief §4c export).
function buildEmailHtml(n) {
  const items = (n.featured || [])
    .map((s) => resources.bySlug(s))
    .filter(Boolean)
    .map((r) => `<div style="border:1px solid #E5DDD0;border-radius:12px;padding:12px;margin-top:8px"><strong style="font-family:Georgia,serif">${r.name}</strong><br><span style="color:#4A5A50">${r.neighbourhood}${r.city ? ', ' + r.city : ''} — ${r.shortDescription || r.description || ''}</span></div>`)
    .join('');
  return `<!doctype html><html><body style="margin:0;background:#FAF7F0;font-family:Inter,Arial,sans-serif;color:#1C2A21">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
<div style="background:#2D5A3D;padding:16px 20px;color:#fff;font-family:Georgia,serif;font-size:18px">East Bay Regeneration Map</div>
<div style="padding:20px">
<h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px">${n.subject}</h1>
<p style="font-size:15px;line-height:1.6;white-space:pre-line">${n.body}</p>
${items ? `<p style="text-transform:uppercase;letter-spacing:.08em;font-size:12px;color:#6B7A6F;margin-top:16px">Featured on the map</p>${items}` : ''}
<p style="border-top:1px solid #E5DDD0;margin-top:20px;padding-top:12px;font-size:12px;color:#6B7A6F">You're receiving this because you opted in. <a href="#" style="color:#2D5A3D">Unsubscribe</a>.</p>
</div></div></body></html>`;
}
function exportHtml(n) {
  const blob = new Blob([buildEmailHtml(n)], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `newsletter-${n.id}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

useTitle('Newsletter — East Bay Regeneration Map');
onMounted(() => { if (!resources.resources.length) resources.fetchAll(); });
</script>
