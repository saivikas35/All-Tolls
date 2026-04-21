export function recommendTemplates(userProfile, templates) {
  return templates
    .map(t => {
      let score = 0;

      if (t.recommendedFor.includes(userProfile.level)) score += 40;
      if (t.columns === userProfile.preferredColumns) score += 20;
      score += t.atsScoreWeight;

      return { ...t, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6); // top recommendations
}
