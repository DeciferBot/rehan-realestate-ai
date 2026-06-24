import { checkGrounding, parseAedAmounts, type InventoryFacts } from "../src/lib/guardrail.ts";

const facts: InventoryFacts = {
  minPrice: 1_980_000,
  maxPrice: 88_000_000,
  projectNames: [
    "Akala Hotels and Residences",
    "W Residences at Dubai Harbour",
    "Masaar",
    "Inaura",
  ],
};

type Case = { name: string; reply: string; expectBlock: boolean; expectWarn: boolean };

const cases: Case[] = [
  { name: "grounded price + real project", reply: "We have a 1BR at W Residences at Dubai Harbour for AED 4.96M — want details?", expectBlock: false, expectWarn: false },
  { name: "price above ceiling (250M)", reply: "I can secure you a penthouse for AED 250 million.", expectBlock: true, expectWarn: false },
  { name: "price above ceiling (120M words)", reply: "There's a villa available at 120 million.", expectBlock: true, expectWarn: false },
  { name: "fabricated development name", reply: "You'd love Palm Vista Residences, it's stunning.", expectBlock: false, expectWarn: true },
  { name: "real development name (no warn)", reply: "Akala Hotels and Residences has 1BRs from AED 4.9M.", expectBlock: false, expectWarn: false },
  { name: "down payment below min is fine", reply: "The down payment would be about AED 993K on that unit.", expectBlock: false, expectWarn: false },
  { name: "exactly at max is fine", reply: "Our top unit is AED 88M.", expectBlock: false, expectWarn: false },
];

const amt = parseAedAmounts("AED 4,960,000 / AED 2.5M / 250 million / AED 993K");
const amtOk =
  amt.includes(4_960_000) && amt.includes(2_500_000) && amt.includes(250_000_000) && amt.includes(993_000);

let pass = 0;
let fail = 0;
console.log(`parseAedAmounts → [${amt.join(", ")}]  ${amtOk ? "PASS" : "FAIL"}`);
amtOk ? pass++ : fail++;

for (const c of cases) {
  const g = checkGrounding(c.reply, facts);
  const blockOk = (g.blocking.length > 0) === c.expectBlock;
  const warnOk = (g.warnings.length > 0) === c.expectWarn;
  const ok = blockOk && warnOk;
  ok ? pass++ : fail++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${c.name}` +
      (ok ? "" : `\n      block=${JSON.stringify(g.blocking)} warn=${JSON.stringify(g.warnings)}`)
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
