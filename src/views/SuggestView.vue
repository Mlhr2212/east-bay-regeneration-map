<template>
  <div class="min-h-screen bg-regen-paper font-inter text-regen-ink">
    <PageHeader v-if="!done" :back="{ to: '/regeneration', label: 'Back to the map' }" :eyebrow="eyebrow" :title="heading" width="680px">
      <p>{{ intro }}</p>
    </PageHeader>
    <div class="mx-auto max-w-[680px] px-6 py-8">
      <!-- Success state -->
      <div v-if="done" class="mt-8 rounded-2xl border border-regen-line bg-regen-surface p-8 text-center">
        <i class="rm-pop fa-solid fa-circle-check inline-block text-3xl text-regen-success" aria-hidden="true"></i>
        <h1 class="mt-3 font-fraunces text-[26px] font-600 text-regen-ink">Thank you — sent for review.</h1>
        <p class="mt-2 font-inter text-regen-ink-soft">
          A Guild volunteer will check this before anything goes public. Nothing you submit appears on the map until it's approved.
        </p>
        <div class="mt-5 flex justify-center gap-3">
          <RouterLink to="/regeneration" class="rounded-xl bg-regen-moss px-4 py-2.5 font-inter text-sm font-semibold text-white hover:bg-regen-moss-dark">Back to the map</RouterLink>
          <button type="button" class="rounded-xl border border-regen-line bg-regen-surface px-4 py-2.5 font-inter text-sm font-semibold text-regen-ink hover:border-regen-moss" @click="resetForm">Submit another</button>
        </div>
      </div>

      <form v-else class="mt-6" @submit.prevent="onSubmit">
        <!-- Privacy warning (brief §4) -->
        <p class="mt-4 flex items-start gap-2 rounded-xl border border-regen-warning/30 bg-regen-warning/5 px-4 py-3 font-inter text-[13px] leading-relaxed text-regen-ink-soft">
          <i class="fa-solid fa-triangle-exclamation mt-0.5 text-regen-warning" aria-hidden="true"></i>
          Please don't submit private home addresses, personal phone numbers, or personal email addresses. Share a neighbourhood and a public link instead.
        </p>

        <div class="mt-6 space-y-5">
          <!-- Correction/report: which listing -->
          <div v-if="targetName" class="rounded-xl border border-regen-line bg-regen-surface px-4 py-3 font-inter text-sm text-regen-ink-soft">
            {{ mode === 'report' ? 'Reporting' : 'Correcting' }}: <span class="font-semibold text-regen-ink">{{ targetName }}</span>
          </div>

          <p class="font-inter text-[13px] text-regen-muted">Fields marked <span class="font-semibold text-regen-danger">*</span> are required.</p>

          <!-- Name (new only) -->
          <div v-if="mode === 'new'">
            <label :class="labelCls" for="f-name">Name of the place <span class="text-regen-danger" aria-hidden="true">*</span></label>
            <input id="f-name" v-model.trim="form.name" type="text" :class="[inputCls, 'rm-field']" placeholder="e.g. South Berkeley Repair Café" aria-required="true" :aria-invalid="!!errors.name" :aria-describedby="errors.name ? 'err-name' : undefined" />
            <p v-if="errors.name" id="err-name" role="alert" :class="errCls">{{ errors.name }}</p>
          </div>

          <!-- Type (new only) -->
          <div v-if="mode === 'new'">
            <label :class="labelCls" for="f-type">Type of resource <span class="text-regen-danger" aria-hidden="true">*</span></label>
            <select id="f-type" v-model="form.type" :class="[inputCls, 'rm-field']" aria-required="true" :aria-invalid="!!errors.type" :aria-describedby="errors.type ? 'err-type' : undefined">
              <option value="">Choose a type…</option>
              <option v-for="(t, key) in resourceTypes" :key="key" :value="key">{{ t.label }}</option>
            </select>
            <p v-if="errors.type" id="err-type" role="alert" :class="errCls">{{ errors.type }}</p>
          </div>

          <!-- Neighbourhood + city (new only) -->
          <div v-if="mode === 'new'" class="grid gap-5 sm:grid-cols-2">
            <div>
              <label :class="labelCls" for="f-nb">Neighbourhood <span class="text-regen-danger" aria-hidden="true">*</span></label>
              <input id="f-nb" v-model.trim="form.neighbourhood" type="text" :class="[inputCls, 'rm-field']" placeholder="e.g. Fruitvale" aria-required="true" :aria-invalid="!!errors.neighbourhood" :aria-describedby="errors.neighbourhood ? 'err-nb' : undefined" />
              <p v-if="errors.neighbourhood" id="err-nb" role="alert" :class="errCls">{{ errors.neighbourhood }}</p>
            </div>
            <div>
              <label :class="labelCls" for="f-city">City</label>
              <input id="f-city" v-model.trim="form.city" type="text" :class="inputCls" placeholder="e.g. Oakland" />
            </div>
          </div>

          <!-- Participate (new only) -->
          <div v-if="mode === 'new'">
            <label :class="labelCls">Ways to participate</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(p, key) in participateOptions"
                :key="key"
                type="button"
                class="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 font-inter text-sm font-semibold transition"
                :class="form.participate.includes(key) ? 'bg-regen-moss text-white' : 'border border-regen-line bg-regen-surface text-regen-ink hover:border-regen-moss'"
                :aria-pressed="form.participate.includes(key)"
                @click="toggleParticipate(key)"
              ><i class="fa-solid" :class="p.icon" aria-hidden="true"></i> {{ p.label }}</button>
            </div>
          </div>

          <!-- Details (all modes) -->
          <div>
            <label :class="labelCls" for="f-details">{{ detailsLabel }} <span class="text-regen-danger" aria-hidden="true">*</span></label>
            <textarea id="f-details" v-model.trim="form.details" rows="4" :class="[inputCls, 'rm-field']" :placeholder="detailsPlaceholder" aria-required="true" :aria-invalid="!!errors.details" :aria-describedby="errors.details ? 'err-details' : undefined"></textarea>
            <p v-if="errors.details" id="err-details" role="alert" :class="errCls">{{ errors.details }}</p>
          </div>

          <!-- Source -->
          <div>
            <label :class="labelCls" for="f-source">Public source link</label>
            <input id="f-source" v-model.trim="form.source" type="url" :class="[inputCls, 'rm-field']" placeholder="https://…" :disabled="form.firsthand" :aria-invalid="!!errors.source" :aria-describedby="errors.source ? 'err-source' : undefined" />
            <label class="mt-2 inline-flex cursor-pointer items-center gap-2 font-inter text-sm text-regen-ink-soft">
              <input type="checkbox" v-model="form.firsthand" class="h-4 w-4 rounded border-regen-line text-regen-moss focus:ring-regen-moss" />
              I don't have a link — I know this project personally
            </label>
            <p v-if="errors.source" id="err-source" role="alert" :class="errCls">{{ errors.source }}</p>
          </div>
        </div>

        <button
          type="submit"
          class="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-regen-moss px-6 font-inter text-sm font-semibold text-white transition hover:bg-regen-moss-dark active:scale-[0.99]"
        >
          <i class="fa-solid fa-paper-plane" aria-hidden="true"></i> {{ submitLabel }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { useProposalsStore, useResourcesStore, useAlertStore } from '@/stores';
import PageHeader from '@/components/PageHeader.vue';
import { RESOURCE_TYPES, PARTICIPATE, containsPrivateData } from '@/_config/RegenConfig';

const route = useRoute();
const proposals = useProposalsStore();
const resources = useResourcesStore();
const alert = useAlertStore();

const resourceTypes = RESOURCE_TYPES;
const participateOptions = PARTICIPATE;

const labelCls = 'mb-1.5 block font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-regen-muted';
const inputCls = 'w-full rounded-xl border border-regen-line bg-regen-surface px-4 py-3 font-inter text-[15px] text-regen-ink outline-none focus:border-regen-moss focus:ring-2 focus:ring-regen-moss/30 disabled:opacity-50';
const errCls = 'mt-1.5 font-inter text-[13px] font-semibold text-regen-danger';

// Mode from query: ?correct=slug, ?report=slug, else new.
const mode = computed(() => (route.query.report ? 'report' : route.query.correct ? 'correction' : 'new'));
const targetSlug = computed(() => route.query.report || route.query.correct || null);
const targetName = computed(() => (targetSlug.value ? resources.bySlug(targetSlug.value)?.name || targetSlug.value : null));

const form = reactive({ name: '', type: '', neighbourhood: '', city: '', participate: [], details: '', source: '', firsthand: false });
const errors = reactive({});
const done = ref(false);

const eyebrow = computed(() => (mode.value === 'report' ? 'Report a listing' : mode.value === 'correction' ? 'Suggest a correction' : 'Suggest a new place'));
const heading = computed(() => (mode.value === 'report' ? 'Something wrong with this listing?' : mode.value === 'correction' ? 'Help us keep this current' : 'Know a place we should add?'));
const intro = computed(() => 'Thank you for helping keep the map honest. A Guild volunteer reviews every submission before it appears — nothing is published automatically.');
const detailsLabel = computed(() => (mode.value === 'report' ? "What's wrong?" : mode.value === 'correction' ? 'What should change?' : 'Describe the place'));
const detailsPlaceholder = computed(() =>
  mode.value === 'report' ? 'e.g. This fridge has been removed / the listing is a duplicate.'
    : mode.value === 'correction' ? 'e.g. Hours changed to Tue–Sat 10am–6pm.'
    : 'What is it, who is it for, how can people get involved?'
);
const submitLabel = computed(() => (mode.value === 'report' ? 'Send report' : 'Send for review'));

function toggleParticipate(key) {
  const i = form.participate.indexOf(key);
  i === -1 ? form.participate.push(key) : form.participate.splice(i, 1);
}

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (mode.value === 'new') {
    if (!form.name) errors.name = 'Give the place a name.';
    if (!form.type) errors.type = 'Choose a type.';
    if (!form.neighbourhood) errors.neighbourhood = 'Add a neighbourhood so people can find it.';
  }
  if (!form.details) errors.details = 'Please add a short note.';
  if (!form.firsthand && !form.source) errors.source = 'Add a public link, or tick "I know this project personally".';
  // Privacy block (brief §1) — check every free-text field.
  for (const [field, val] of [['details', form.details], ['name', form.name], ['source', form.source]]) {
    if (containsPrivateData(val)) {
      errors[field] = 'Please remove private addresses or phone numbers — share a neighbourhood and a public link instead.';
    }
  }
  return Object.keys(errors).length === 0;
}

// Map error keys to field ids so we can move focus to the first invalid field
// on submit (WCAG 3.3.1 — error identification + focus management).
const ERR_FIELD_ID = { name: 'f-name', type: 'f-type', neighbourhood: 'f-nb', details: 'f-details', source: 'f-source' };

function onSubmit() {
  if (!validate()) {
    alert.error('Please fix the highlighted fields.');
    const firstKey = Object.keys(errors)[0];
    nextTick(() => document.getElementById(ERR_FIELD_ID[firstKey])?.focus());
    return;
  }
  const kind = mode.value === 'new' ? 'new' : 'correction';
  proposals.submit({
    kind,
    targetSlug: targetSlug.value,
    source: form.firsthand ? 'I know this project' : form.source,
    sourceType: 'community',
    fields: mode.value === 'new'
      ? { name: form.name, type: form.type, neighbourhood: form.neighbourhood, city: form.city, participate: [...form.participate], serves: form.details }
      : { report: mode.value === 'report', note: form.details },
  });
  alert.success('Suggestion sent for review.');
  done.value = true;
}

function resetForm() {
  Object.assign(form, { name: '', type: '', neighbourhood: '', city: '', participate: [], details: '', source: '', firsthand: false });
  Object.keys(errors).forEach((k) => delete errors[k]);
  done.value = false;
}

useTitle('Suggest a place — East Bay Regeneration Map');
onMounted(() => {
  if (!resources.resources.length) resources.fetchAll();
});
</script>
