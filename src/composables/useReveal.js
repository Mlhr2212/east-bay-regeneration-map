import { onMounted, onBeforeUnmount, nextTick } from 'vue';

/**
 * Scroll-reveal for elements carrying `.rm-reveal` (see motion.css).
 * - Reveals once, when the element enters the viewport.
 * - Honours prefers-reduced-motion: reveals immediately, no transition.
 * - Content is never hidden if JS fails: the `.has-reveal` gate (set in main.js
 *   only when JS runs) is what hides `.rm-reveal` in the first place, so without
 *   JS everything is simply visible.
 * - Returns `scan()` so views whose content loads asynchronously can re-observe
 *   newly rendered `.rm-reveal` elements (otherwise they'd stay hidden).
 *
 * Usage: `const { scan } = useReveal();` then call `scan()` after async data
 * renders. Calling with no re-scan is fine for static views.
 */
export function useReveal(options = {}) {
  let observer = null;
  const reduced = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function revealNow(els) {
    els.forEach((el) => el.classList.add('is-visible'));
  }

  function scan() {
    const els = document.querySelectorAll('.rm-reveal:not(.is-visible)');
    if (!els.length) return;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      revealNow(els);
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target); // once only — never loops
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.12, ...options }
      );
    }
    els.forEach((el) => observer.observe(el));
  }

  onMounted(() => nextTick(scan));
  onBeforeUnmount(() => observer?.disconnect());

  return { scan };
}
