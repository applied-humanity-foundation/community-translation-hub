import type { DiffResult } from '../types';

export function computeDiff(oldText: string, newText: string): DiffResult[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const results: DiffResult[] = [];

  const lcs = longestCommonSubsequence(oldLines, newLines);
  let oi = 0;
  let ni = 0;
  let li = 0;

  while (oi < oldLines.length || ni < newLines.length) {
    if (li < lcs.length && oi < oldLines.length && ni < newLines.length && oldLines[oi] === lcs[li] && newLines[ni] === lcs[li]) {
      results.push({ type: 'unchanged', value: lcs[li] });
      oi++;
      ni++;
      li++;
    } else if (ni < newLines.length && (li >= lcs.length || newLines[ni] !== lcs[li])) {
      results.push({ type: 'added', value: newLines[ni] });
      ni++;
    } else if (oi < oldLines.length && (li >= lcs.length || oldLines[oi] !== lcs[li])) {
      results.push({ type: 'removed', value: oldLines[oi] });
      oi++;
    }
  }

  return results;
}

function longestCommonSubsequence(a: string[], b: string[]): string[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const result: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result;
}

export function renderDiffHtml(diffs: DiffResult[]): string {
  return diffs
    .map((d) => {
      const cls = d.type === 'added' ? 'diff-added' : d.type === 'removed' ? 'diff-removed' : 'diff-unchanged';
      const prefix = d.type === 'added' ? '+' : d.type === 'removed' ? '-' : ' ';
      return `<div class="${cls}"><span class="diff-prefix">${prefix}</span>${escapeHtml(d.value)}</div>`;
    })
    .join('\n');
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function diffStats(diffs: DiffResult[]): { added: number; removed: number; unchanged: number } {
  return {
    added: diffs.filter((d) => d.type === 'added').length,
    removed: diffs.filter((d) => d.type === 'removed').length,
    unchanged: diffs.filter((d) => d.type === 'unchanged').length,
  };
}
