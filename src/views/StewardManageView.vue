<template>
  <div class="min-h-screen bg-regen-paper font-inter text-regen-ink">
    <div class="mx-auto max-w-[680px] px-6 py-8">
      <RouterLink :to="`/regeneration/${slug}`" class="inline-flex items-center gap-2 font-inter text-sm font-semibold text-regen-moss hover:underline">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to listing
      </RouterLink>

      <div v-if="!resource" class="mt-10 rounded-2xl border border-dashed border-regen-line bg-regen-surface p-10 text-center">
        <p class="font-fraunces text-[22px] font-600">That listing doesn't exist.</p>
        <RouterLink to="/regeneration" class="mt-4 inline-block rounded-xl bg-regen-moss px-4 py-2.5 font-inter text-sm font-semibold text-white">Back to the map</RouterLink>
      </div>

      <template v-else>
        <p class="mt-4 font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-moss">Steward view</p>
        <h1 class="mt-1 font-fraunces text-[30px] font-700 leading-[1.15] text-regen-ink">{{ resource.name }}</h1>

        <p class="mt-3 flex items-start gap-2 rounded-xl border border-regen-line bg-regen-surface px-4 py-3 font-inter text-[13px] leading-relaxed text-regen-ink-soft">
          <i class="fa-solid fa-circle-info mt-0.5 text-regen-moss" aria-hidden="true"></i>
          Demo claim — no real identity check is done this weekend. In production, claiming verifies your role at the project. Contact details you enter are for moderation only and are never published.
        </p>

        <!-- Claim step -->
        <form v-if="!resource.stewardClaimed" class="mt-6 rounded-2xl border border-regen-line bg-regen-surface p-5" @submit.prevent="claim">
          <h2 class="font-fraunces text-[18px] font-600 text-regen-ink">Claim this listing</h2>
          <div class="mt-4 space-y-4">
            <div>
              <label :class="labelCls" for="c-name">Your name <span class="text-regen-danger">*</span></label>
              <input id="c-name" v-model.trim="claimForm.name" :class="inputCls" />
              <p v-if="claimErr.name" :class="errCls">{{ claimErr.name }}</p>
            </div>
            <div>
              <label :class="labelCls" for="c-role">Your role at this project <span class="text-regen-danger">*</span></label>
              <input id="c-role" v-model.trim="claimForm.role" :class="inputCls" placeholder="e.g. Volunteer coordinator" />
              <p v-if="claimErr.role" :class="errCls">{{ claimErr.role }}</p>
            </div>
            <div>
              <label :class="labelCls" for="c-contact">Contact for moderation (never published)</label>
              <input id="c-contact" v-model.trim="claimForm.contact" :class="inputCls" placeholder="How a volunteer can reach you" />
            </div>
          </div>
          <button type="submit" class="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-regen-moss px-5 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark">
            <i class="fa-solid fa-hand" aria-hidden="true"></i> Claim (demo)
          </button>
        </form>

        <!-- Manage step -->
        <template v-else>
          <div class="mt-6 rounded-2xl border border-regen-line bg-regen-surface p-5">
            <h2 class="font-fraunces text-[18px] font-600 text-regen-ink">Edit your listing</h2>
            <div class="mt-4 space-y-4">
              <div>
                <label :class="labelCls" for="m-hours">Hours</label>
                <input id="m-hours" v-model.trim="edit.hours" :class="inputCls" placeholder="e.g. Sat 10am–1pm" />
              </div>
              <div>
                <label :class="labelCls" for="m-desc">Description</label>
                <textarea id="m-desc" v-model.trim="edit.description" rows="4" :class="inputCls"></textarea>
              </div>
              <div>
                <label :class="labelCls">Status</label>
                <div class="flex gap-2">
                  <button v-for="s in statuses" :key="s" type="button"
                    class="rounded-full px-4 py-2 font-inter text-sm font-semibold transition"
                    :class="edit.status === s ? 'bg-regen-moss text-white' : 'border border-regen-line bg-regen-surface text-regen-ink hover:border-regen-moss'"
                    @click="edit.status = s">{{ statusLabel(s) }}</button>
                </div>
              </div>
            </div>
            <button type="button" class="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-regen-moss px-5 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark" @click="save">
              <i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Save changes
            </button>
          </div>

          <!-- Pending suggestions for this listing -->
          <div class="mt-6">
            <h2 class="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted">Pending suggestions for your listing</h2>
            <p v-if="!mySuggestions.length" class="mt-2 font-inter text-sm text-regen-muted">None right now.</p>
            <ul v-else class="mt-2 space-y-2">
              <li v-for="p in mySuggestions" :key="p.id" class="rounded-xl border border-regen-line bg-regen-surface px-4 py-3 font-inter text-sm text-regen-ink-soft">
                {{ summarise(p) }} <span class="text-regen-muted">· {{ p.submittedAt }}</span>
              </li>
            </ul>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { useResourcesStore, useProposalsStore, useAlertStore } from '@/stores';
import { statusMeta } from '@/_config/RegenConfig';

const route = useRoute();
const resources = useResourcesStore();
const proposals = useProposalsStore();
const alert = useAlertStore();

const labelCls = 'mb-1.5 block font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted';
const inputCls = 'w-full rounded-xl border border-regen-line bg-regen-paper px-4 py-3 font-inter text-[15px] text-regen-ink outline-none focus:border-regen-moss focus:ring-2 focus:ring-regen-moss/30';
const errCls = 'mt-1.5 font-inter text-[13px] font-semibold text-regen-danger';
const statuses = ['active', 'needs_verification', 'inactive'];

const slug = computed(() => route.params.slug);
const resource = computed(() => resources.bySlug(slug.value));

const claimForm = reactive({ name: '', role: '', contact: '' });
const claimErr = reactive({});
const edit = reactive({ hours: '', description: '', status: 'active' });

const mySuggestions = computed(() =>
  proposals.pending.filter((p) => p.targetSlug === slug.value)
);

function statusLabel(s) { return statusMeta(s).label; }
function summarise(p) {
  const f = p.fields || {};
  if (f.hours?.new) return `Hours → ${f.hours.new}`;
  if (f.map_status?.new) return `Status → ${f.map_status.new}`;
  return f.note || 'Suggested change';
}

function claim() {
  Object.keys(claimErr).forEach((k) => delete claimErr[k]);
  if (!claimForm.name) claimErr.name = 'Add your name.';
  if (!claimForm.role) claimErr.role = 'Add your role at the project.';
  if (Object.keys(claimErr).length) return;
  resources.claimListing(slug.value);
  alert.success('Listing claimed (demo). You can now manage it.');
}

function save() {
  resources.updateListing(slug.value, { hours: edit.hours, description: edit.description, status: edit.status });
  alert.success('Saved — your listing is updated and stamped checked today.');
}

function syncEdit(r) {
  if (!r) return;
  edit.hours = r.hours || '';
  edit.description = r.description || '';
  edit.status = r.status || 'active';
}

useTitle('Manage listing — East Bay Regeneration Map');
watch(resource, syncEdit, { immediate: true });
onMounted(() => { if (!resources.resources.length) resources.fetchAll(); });
</script>
