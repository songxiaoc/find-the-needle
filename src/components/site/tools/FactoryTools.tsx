'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { DIAGNOSIS_SOURCES, type FactoryCopy } from '@/content/factory-tools';

import { Link } from '@/core/i18n/navigation';

import {
  CHECKLIST_IDS,
  readChecklist,
  saveChecklist,
} from './checklist-storage';
import {
  calculateProduction,
  parseMeasurement,
  type ProductionInputs,
  type ProductionResult,
} from './production-math';

const PANEL =
  'border-site-outline-strong bg-site-surface-container border p-5 md:p-7';
const BUTTON =
  'border-site-primary text-site-primary hover:bg-site-primary/10 focus-visible:outline-site-primary min-h-11 border px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-4';
const INPUT =
  'border-site-outline-strong bg-site-surface text-site-on-surface focus-visible:outline-site-primary w-full min-w-0 border p-3 focus-visible:outline-2 focus-visible:outline-offset-2';
const CHECK_IDS = CHECKLIST_IDS;
const MAX_STAGES = 12;

function interaction(action: string, tool: string) {
  document.dispatchEvent(
    new CustomEvent('factory-interaction', { detail: { action, tool } })
  );
}

export type ToolLink = { href: string; label: string };

export function LineCheck({
  copy,
  links,
}: {
  copy: FactoryCopy['diagnosis'];
  links: ToolLink[][];
}) {
  const [selected, setSelected] = useState(0);
  const symptom = copy.symptoms[selected];
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(240px,1fr)_2fr]">
      <fieldset className={PANEL}>
        <legend className="site-headline-sm px-2">{copy.prompt}</legend>
        <div className="grid gap-3">
          {copy.symptoms.map((item, index) => (
            <button
              key={index}
              type="button"
              aria-pressed={index === selected}
              onClick={() => {
                setSelected(index);
                interaction('diagnosis_select', 'line-check');
              }}
              className={`${BUTTON} text-left ${selected === index ? 'bg-site-primary/15 border-2 font-semibold' : ''}`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </fieldset>
      <section className={PANEL} aria-live="polite" aria-atomic="true">
        <h2 className="site-headline-lg">{symptom.title}</h2>
        <h3 className="site-headline-sm mt-6">{copy.steps}</h3>
        <ol className="mt-4 list-decimal space-y-3 pl-6 text-sm leading-7">
          {symptom.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="text-site-on-surface-variant border-site-primary mt-5 border-l-2 pl-4 text-sm leading-7">
          {symptom.note}
        </p>
        {links[selected]?.length > 0 && (
          <nav className="mt-6" aria-label={copy.links}>
            <h3 className="site-headline-sm">{copy.links}</h3>
            <ul className="mt-3 space-y-3">
              {links[selected].map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-site-primary underline underline-offset-4"
                    href={link.href}
                  >
                    {link.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <details className="text-site-on-surface-variant mt-6 text-sm">
          <summary className="cursor-pointer py-2">{copy.sources}</summary>
          <ul className="mt-3 space-y-3">
            {DIAGNOSIS_SOURCES[selected].map((href, index) => (
              <li key={href}>
                <a
                  className="text-site-primary underline underline-offset-4"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  Steam · {index + 1} ↗
                </a>
              </li>
            ))}
          </ul>
        </details>
      </section>
    </div>
  );
}

export function FactoryChecklist({ copy }: { copy: FactoryCopy['checklist'] }) {
  const [checks, setChecks] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const saved = readChecklist(() => localStorage);
    setChecks(saved.checks);
    setError(saved.error);
    setReady(true);
  }, []);
  function change(next: string[], reset = false) {
    setChecks(next);
    setError(!saveChecklist(() => localStorage, next, reset));
    interaction(reset ? 'checklist_reset' : 'checklist_toggle', 'checklist');
  }
  return (
    <section className={PANEL}>
      <p className="text-site-on-surface-variant text-sm leading-7">
        {copy.note}
      </p>
      <p className="mt-5 font-semibold tabular-nums" role="status">
        {ready
          ? `${copy.progress}: ${checks.length} / ${CHECK_IDS.length}`
          : copy.loading}
      </p>
      <progress
        className="accent-site-primary mt-3 h-3 w-full"
        value={checks.length}
        max={CHECK_IDS.length}
        aria-label={copy.progress}
      />
      {error && (
        <p role="alert" className="border-site-primary mt-4 border p-4 text-sm">
          {copy.error}
        </p>
      )}
      <fieldset
        disabled={!ready}
        className="divide-site-outline-strong mt-5 divide-y"
      >
        {copy.items.map((item, index) => (
          <label
            key={CHECK_IDS[index]}
            className="flex cursor-pointer items-start gap-4 py-4 text-sm leading-7"
          >
            <input
              type="checkbox"
              className="accent-site-primary mt-1 h-5 w-5 shrink-0"
              checked={checks.includes(CHECK_IDS[index])}
              onChange={(event) =>
                change(
                  event.target.checked
                    ? [...checks, CHECK_IDS[index]]
                    : checks.filter((id) => id !== CHECK_IDS[index])
                )
              }
            />
            <span>{item}</span>
          </label>
        ))}
      </fieldset>
      <div className="mt-6 flex flex-wrap items-center gap-5">
        <button
          type="button"
          disabled={!ready}
          className={BUTTON}
          onClick={() => change([], true)}
        >
          {copy.reset}
        </button>
        <Link
          href="/guides/guide/automation"
          className="text-site-primary underline underline-offset-4"
        >
          {copy.guide} →
        </Link>
      </div>
    </section>
  );
}

function newPlan(): ProductionInputs {
  return {
    rates: ['', '', ''],
    stock: '',
    price: '',
    investment: '',
    operating: '',
  };
}

export function ProductionCalculator({
  copy,
  locale,
}: {
  copy: FactoryCopy['calculator'];
  locale: string;
}) {
  const [plans, setPlans] = useState<ProductionInputs[]>([
    newPlan(),
    newPlan(),
  ]);
  const [errors, setErrors] = useState<(string | null)[]>([null, null]);
  const [results, setResults] = useState<(ProductionResult | null)[] | null>(
    null
  );
  const format = new Intl.NumberFormat(locale, { maximumSignificantDigits: 6 });
  function update(index: number, next: ProductionInputs) {
    setPlans((current) =>
      current.map((plan, i) => (i === index ? next : plan))
    );
    setResults(null);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    const output = plans.map((plan, index) =>
      index === 1 &&
      [
        ...plan.rates,
        plan.stock,
        plan.price,
        plan.investment,
        plan.operating,
      ].every((value) => value.trim() === '')
        ? null
        : calculateProduction(plan)
    );
    setErrors(output.map((item) => (item?.error ? copy[item.error] : null)));
    if (output.every((item) => !item || item.result)) {
      setResults(output.map((item) => item?.result ?? null));
      interaction('calculator_compare', 'production-calculator');
    } else setResults(null);
  }
  function field(
    plan: ProductionInputs,
    planIndex: number,
    key: 'stock' | 'price' | 'investment' | 'operating'
  ) {
    const id = `plan-${planIndex}-${key}`;
    return (
      <div key={key}>
        <label htmlFor={id} className="mb-2 block text-sm">
          {copy[key]}
        </label>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          className={INPUT}
          value={plan[key]}
          aria-invalid={
            Boolean(errors[planIndex]) && parseMeasurement(plan[key]) === null
          }
          aria-describedby={
            errors[planIndex] ? `plan-${planIndex}-error` : undefined
          }
          onChange={(event) =>
            update(planIndex, { ...plan, [key]: event.target.value })
          }
        />
      </div>
    );
  }
  function resultRows(result: ProductionResult) {
    const payback =
      result.capacity === 0
        ? copy.stopped
        : result.stock === 0
          ? copy.empty
          : result.payback === null
            ? copy.never
            : result.payback > (result.duration ?? 0)
              ? copy.insufficient
              : `${format.format(result.payback)} ${copy.minutes}`;
    return [
      [copy.capacity, `${format.format(result.capacity)} ${copy.units}`],
      [
        copy.bottleneck,
        result.bottlenecks.map((stage) => `${copy.stage} ${stage}`).join(', '),
      ],
      [
        copy.duration,
        result.duration === null
          ? copy.stopped
          : `${format.format(result.duration)} ${copy.minutes}`,
      ],
      [copy.revenue, `${format.format(result.revenue)} ${copy.currency}`],
      [
        copy.profit,
        result.profit === null
          ? copy.stopped
          : `${format.format(result.profit)} ${copy.currency}`,
      ],
      [
        copy.margin,
        `${format.format(result.margin)} ${copy.currency}/${copy.minutes}`,
      ],
      [copy.payback, payback],
    ];
  }
  return (
    <div>
      <p className="text-site-on-surface-variant mb-4 text-sm leading-7">
        {copy.note}
      </p>
      <p className="border-site-outline-strong mb-6 border-l-2 pl-4 text-sm leading-7">
        {copy.assumption}
      </p>
      <form onSubmit={submit} noValidate>
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {plans.map((plan, planIndex) => (
            <fieldset key={planIndex} className={PANEL}>
              <legend className="site-headline-lg px-2">
                {copy.plan} {planIndex === 0 ? 'A' : 'B'}
                {planIndex === 1 ? ` (${copy.optional})` : ''}
              </legend>
              <div className="grid gap-4">
                {plan.rates.map((rate, stageIndex) => (
                  <div key={stageIndex}>
                    <label
                      className="mb-2 block text-sm"
                      htmlFor={`rate-${planIndex}-${stageIndex}`}
                    >
                      {copy.stage} {stageIndex + 1} · {copy.rate}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id={`rate-${planIndex}-${stageIndex}`}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        className={INPUT}
                        value={rate}
                        aria-invalid={
                          Boolean(errors[planIndex]) &&
                          parseMeasurement(rate) === null
                        }
                        aria-describedby={
                          errors[planIndex]
                            ? `plan-${planIndex}-error`
                            : undefined
                        }
                        onChange={(event) =>
                          update(planIndex, {
                            ...plan,
                            rates: plan.rates.map((value, i) =>
                              i === stageIndex ? event.target.value : value
                            ),
                          })
                        }
                      />
                      {plan.rates.length > 1 && (
                        <button
                          type="button"
                          className={`${BUTTON} shrink-0 px-3`}
                          aria-label={`${copy.remove} ${stageIndex + 1} · ${copy.plan} ${planIndex === 0 ? 'A' : 'B'}`}
                          onClick={() =>
                            update(planIndex, {
                              ...plan,
                              rates: plan.rates.filter(
                                (_, i) => i !== stageIndex
                              ),
                            })
                          }
                        >
                          −
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                disabled={plan.rates.length >= MAX_STAGES}
                className={`${BUTTON} mt-4 disabled:opacity-50`}
                onClick={() =>
                  update(planIndex, { ...plan, rates: [...plan.rates, ''] })
                }
              >
                {copy.add}
              </button>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {(['stock', 'price', 'investment', 'operating'] as const).map(
                  (key) => field(plan, planIndex, key)
                )}
              </div>
              {errors[planIndex] && (
                <p
                  role="alert"
                  id={`plan-${planIndex}-error`}
                  className="border-site-primary mt-4 border p-3 text-sm"
                >
                  {errors[planIndex]}
                </p>
              )}
            </fieldset>
          ))}
        </div>
        <button
          type="submit"
          className={`${BUTTON} bg-site-primary text-site-on-primary mt-6 font-semibold`}
        >
          {copy.calculate}
        </button>
      </form>
      {results && (
        <section className="mt-8" aria-live="polite">
          <h2 className="site-headline-lg">{copy.comparison}</h2>
          <p className="text-site-on-surface-variant mt-3 text-sm leading-7">
            {copy.resultHint}
          </p>
          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            {results.map(
              (result, index) =>
                result && (
                  <article className={PANEL} key={index}>
                    <h3 className="site-headline-sm">
                      {copy.plan} {index === 0 ? 'A' : 'B'}
                    </h3>
                    <dl className="divide-site-outline-strong mt-4 divide-y">
                      {resultRows(result).map(([label, value]) => (
                        <div
                          className="grid gap-2 py-4 sm:grid-cols-2"
                          key={label}
                        >
                          <dt className="text-site-on-surface-variant text-sm">
                            {label}
                          </dt>
                          <dd className="text-sm font-semibold break-words tabular-nums">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                )
            )}
          </div>
          {results.every((result) => result && result.profit !== null) && (
            <p className="mt-5 text-sm font-semibold">
              {results[0]!.profit === results[1]!.profit
                ? copy.equal
                : `${copy.better} ${copy.plan} ${results[0]!.profit! > results[1]!.profit! ? 'A' : 'B'}`}
            </p>
          )}
        </section>
      )}
      <details className="text-site-on-surface-variant mt-7 text-sm leading-7">
        <summary className="cursor-pointer py-2">{copy.formulas}</summary>
        <p className="mt-3">{copy.formulaText}</p>
      </details>
    </div>
  );
}
