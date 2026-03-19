"use client";

interface PropertyMatchData {
  score: number;
  reasons: string[];
  warning?: string;
}

export default function PropertyMatchScore({ data }: { data: PropertyMatchData }) {
  if (!data) return null;

  return (
    <div className="rounded-xl border p-4 bg-green-50">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Match for You</h3>
        <span className="text-2xl font-bold text-green-600">
          {data.score}%
        </span>
      </div>

      <ul className="mt-3 space-y-1 text-sm">
        {data.reasons.map((reason, i) => (
          <li key={i} className="text-green-700">✔ {reason}</li>
        ))}
      </ul>

      {data.warning && (
        <p className="mt-2 text-xs text-orange-600">
          ⚠ {data.warning}
        </p>
      )}
    </div>
  );
}
