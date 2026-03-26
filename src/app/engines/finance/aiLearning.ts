// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-11 — AI LEARNING LOOP
// ═══════════════════════════════════════════════════════════════════════════
// Narrations → Learning → Confidence → Auto-classification → Review loop
// Version: 1.0 | Build: ENGINE-11

import { AILearningData, AILearningMetrics } from './types';

/**
 * Process AI learning from user feedback
 * Updates confidence scores and improves auto-classification
 */
export function processAILearning(
  learningData: AILearningData[]
): {
  totalProcessed: number;
  acceptedSuggestions: number;
  modifiedSuggestions: number;
  rejectedSuggestions: number;
  averageConfidence: number;
  categoryAccuracy: Record<string, { correct: number; total: number; accuracy: number }>;
} {
  const totalProcessed = learningData.length;
  const acceptedSuggestions = learningData.filter((d) => d.userAction === 'accepted').length;
  const modifiedSuggestions = learningData.filter((d) => d.userAction === 'modified').length;
  const rejectedSuggestions = learningData.filter((d) => d.userAction === 'rejected').length;

  const averageConfidence = learningData.length > 0
    ? learningData.reduce((sum, d) => sum + d.confidenceScore, 0) / learningData.length
    : 0;

  // Calculate category accuracy
  const categoryStats: Record<string, { correct: number; total: number }> = {};

  learningData.forEach((data) => {
    if (!categoryStats[data.suggestedCategory]) {
      categoryStats[data.suggestedCategory] = { correct: 0, total: 0 };
    }

    categoryStats[data.suggestedCategory].total += 1;

    // Consider accepted or same actual category as correct
    if (data.userAction === 'accepted' || 
        (data.actualCategory && data.actualCategory === data.suggestedCategory)) {
      categoryStats[data.suggestedCategory].correct += 1;
    }
  });

  const categoryAccuracy: Record<string, { correct: number; total: number; accuracy: number }> = {};
  Object.entries(categoryStats).forEach(([category, stats]) => {
    categoryAccuracy[category] = {
      correct: stats.correct,
      total: stats.total,
      accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
    };
  });

  return {
    totalProcessed,
    acceptedSuggestions,
    modifiedSuggestions,
    rejectedSuggestions,
    averageConfidence,
    categoryAccuracy,
  };
}

/**
 * Update AI learning metrics with new data
 */
export function updateAILearningMetrics(
  currentMetrics: AILearningMetrics,
  newLearningData: AILearningData[]
): AILearningMetrics {
  const learning = processAILearning(newLearningData);

  const totalNarrations = currentMetrics.totalNarrations + learning.totalProcessed;
  const autoClassified = currentMetrics.autoClassified + learning.acceptedSuggestions;
  const manuallyReviewed = currentMetrics.manuallyReviewed + learning.modifiedSuggestions + learning.rejectedSuggestions;
  const acceptanceRate = totalNarrations > 0 ? (autoClassified / totalNarrations) * 100 : 0;

  // Merge category accuracy
  const categoryAccuracy: Record<string, number> = { ...currentMetrics.categoryAccuracy };
  Object.entries(learning.categoryAccuracy).forEach(([category, stats]) => {
    categoryAccuracy[category] = stats.accuracy;
  });

  // Calculate monthly improvement
  const previousAcceptanceRate = currentMetrics.acceptanceRate;
  const monthlyImprovement = acceptanceRate - previousAcceptanceRate;

  // Set next learning cycle (30 days from now)
  const nextLearningCycle = new Date();
  nextLearningCycle.setDate(nextLearningCycle.getDate() + 30);

  return {
    totalNarrations,
    autoClassified,
    manuallyReviewed,
    acceptanceRate,
    averageConfidence: learning.averageConfidence,
    categoryAccuracy,
    monthlyImprovement,
    lastLearningCycle: new Date().toISOString(),
    nextLearningCycle: nextLearningCycle.toISOString(),
  };
}

/**
 * Generate AI classification suggestion
 * Uses historical learning to suggest category and confidence
 */
export function generateClassificationSuggestion(
  narration: string,
  historicalData: AILearningData[]
): {
  suggestedCategory: string;
  confidenceScore: number;
  reasoning: string;
  alternativeCategories: Array<{ category: string; confidence: number }>;
} {
  // Simple pattern matching based on keywords
  const narrationLower = narration.toLowerCase();
  
  // Category keywords
  const categoryKeywords: Record<string, string[]> = {
    'Office Rent': ['rent', 'lease', 'office space', 'workspace'],
    'Utilities': ['electricity', 'water', 'internet', 'utilities', 'phone bill'],
    'Software': ['software', 'subscription', 'saas', 'license', 'cloud'],
    'Travel': ['flight', 'hotel', 'taxi', 'uber', 'travel', 'accommodation'],
    'Marketing': ['advertising', 'marketing', 'promotion', 'campaign', 'ads'],
    'Client Lunch': ['lunch', 'dinner', 'meal', 'restaurant', 'client'],
    'Salary': ['salary', 'payroll', 'wage', 'compensation'],
    'Equipment': ['laptop', 'computer', 'equipment', 'hardware', 'device'],
  };

  // Find matching categories
  const categoryScores: Record<string, number> = {};
  
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    let score = 0;
    keywords.forEach((keyword) => {
      if (narrationLower.includes(keyword)) {
        score += 20; // Base score for keyword match
      }
    });
    
    if (score > 0) {
      categoryScores[category] = score;
    }
  });

  // Boost scores based on historical acceptance
  historicalData.forEach((data) => {
    if (data.userAction === 'accepted' && 
        data.narration.toLowerCase().includes(narrationLower.substring(0, 10))) {
      const category = data.suggestedCategory;
      categoryScores[category] = (categoryScores[category] || 0) + 10;
    }
  });

  // Get top categories
  const sortedCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .map(([category, score]) => ({
      category,
      confidence: Math.min(100, score),
    }));

  const suggestedCategory = sortedCategories[0]?.category || 'Other';
  const confidenceScore = sortedCategories[0]?.confidence || 30;
  const alternativeCategories = sortedCategories.slice(1, 4);

  let reasoning = '';
  if (confidenceScore >= 80) {
    reasoning = 'High confidence based on keyword match and historical patterns';
  } else if (confidenceScore >= 60) {
    reasoning = 'Moderate confidence based on keyword match';
  } else {
    reasoning = 'Low confidence - manual review recommended';
  }

  return {
    suggestedCategory,
    confidenceScore,
    reasoning,
    alternativeCategories,
  };
}

/**
 * Identify patterns in learning data
 * Finds common narration patterns for improved classification
 */
export function identifyPatterns(
  learningData: AILearningData[]
): Array<{
  pattern: string;
  category: string;
  frequency: number;
  accuracy: number;
}> {
  const patterns: Map<string, { category: string; total: number; correct: number }> = new Map();

  learningData.forEach((data) => {
    // Extract first 3 words as pattern
    const words = data.narration.toLowerCase().split(' ').slice(0, 3).join(' ');
    
    const key = `${words}|${data.suggestedCategory}`;
    
    if (!patterns.has(key)) {
      patterns.set(key, {
        category: data.suggestedCategory,
        total: 0,
        correct: 0,
      });
    }

    const patternData = patterns.get(key)!;
    patternData.total += 1;
    
    if (data.userAction === 'accepted' || 
        (data.actualCategory && data.actualCategory === data.suggestedCategory)) {
      patternData.correct += 1;
    }
  });

  const result: Array<{
    pattern: string;
    category: string;
    frequency: number;
    accuracy: number;
  }> = [];

  patterns.forEach((data, key) => {
    const [pattern, category] = key.split('|');
    const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
    
    if (data.total >= 3) { // Only include patterns that appear at least 3 times
      result.push({
        pattern,
        category,
        frequency: data.total,
        accuracy,
      });
    }
  });

  return result.sort((a, b) => b.frequency - a.frequency);
}

/**
 * Get learning recommendations
 * Suggests improvements to AI classification
 */
export function getLearningRecommendations(
  metrics: AILearningMetrics
): Array<{
  type: 'improve-category' | 'collect-data' | 'review-patterns' | 'adjust-confidence';
  priority: 'high' | 'medium' | 'low';
  message: string;
  action: string;
}> {
  const recommendations: Array<{
    type: 'improve-category' | 'collect-data' | 'review-patterns' | 'adjust-confidence';
    priority: 'high' | 'medium' | 'low';
    message: string;
    action: string;
  }> = [];

  // Check acceptance rate
  if (metrics.acceptanceRate < 50) {
    recommendations.push({
      type: 'collect-data',
      priority: 'high',
      message: 'Low acceptance rate - need more training data',
      action: 'Review and approve more suggestions to improve AI learning',
    });
  }

  // Check category accuracy
  Object.entries(metrics.categoryAccuracy).forEach(([category, accuracy]) => {
    if (accuracy < 60) {
      recommendations.push({
        type: 'improve-category',
        priority: 'medium',
        message: `Low accuracy for category "${category}" (${accuracy.toFixed(1)}%)`,
        action: `Review patterns and examples for ${category}`,
      });
    }
  });

  // Check monthly improvement
  if (metrics.monthlyImprovement < 0) {
    recommendations.push({
      type: 'review-patterns',
      priority: 'high',
      message: 'Accuracy is declining',
      action: 'Review recent changes and identify problematic patterns',
    });
  }

  // Check confidence threshold
  if (metrics.averageConfidence < 70) {
    recommendations.push({
      type: 'adjust-confidence',
      priority: 'medium',
      message: 'Average confidence is low',
      action: 'Consider adjusting confidence thresholds or improving classification rules',
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Calculate optimal confidence threshold
 * Determines the best threshold for auto-posting vs manual review
 */
export function calculateOptimalConfidenceThreshold(
  learningData: AILearningData[]
): {
  optimalThreshold: number;
  expectedAccuracy: number;
  autoPostPercentage: number;
  manualReviewPercentage: number;
} {
  // Group by confidence ranges
  const ranges = [
    { min: 0, max: 50, correct: 0, total: 0 },
    { min: 50, max: 60, correct: 0, total: 0 },
    { min: 60, max: 70, correct: 0, total: 0 },
    { min: 70, max: 80, correct: 0, total: 0 },
    { min: 80, max: 90, correct: 0, total: 0 },
    { min: 90, max: 100, correct: 0, total: 0 },
  ];

  learningData.forEach((data) => {
    const range = ranges.find((r) => data.confidenceScore >= r.min && data.confidenceScore < r.max);
    if (range) {
      range.total += 1;
      if (data.userAction === 'accepted' || 
          (data.actualCategory && data.actualCategory === data.suggestedCategory)) {
        range.correct += 1;
      }
    }
  });

  // Find threshold with >= 90% accuracy
  let optimalThreshold = 80; // Default
  
  for (let i = ranges.length - 1; i >= 0; i--) {
    const range = ranges[i];
    if (range.total >= 10) { // Need at least 10 samples
      const accuracy = (range.correct / range.total) * 100;
      if (accuracy >= 90) {
        optimalThreshold = range.min;
        break;
      }
    }
  }

  // Calculate metrics at optimal threshold
  const aboveThreshold = learningData.filter((d) => d.confidenceScore >= optimalThreshold);
  const expectedAccuracy = aboveThreshold.length > 0
    ? (aboveThreshold.filter((d) => d.userAction === 'accepted').length / aboveThreshold.length) * 100
    : 0;
  
  const autoPostPercentage = learningData.length > 0
    ? (aboveThreshold.length / learningData.length) * 100
    : 0;
  
  const manualReviewPercentage = 100 - autoPostPercentage;

  return {
    optimalThreshold,
    expectedAccuracy,
    autoPostPercentage,
    manualReviewPercentage,
  };
}

/**
 * Generate learning report
 */
export function generateLearningReport(
  metrics: AILearningMetrics,
  learningData: AILearningData[]
): {
  summary: string;
  highlights: string[];
  concerns: string[];
  nextSteps: string[];
} {
  const highlights: string[] = [];
  const concerns: string[] = [];
  const nextSteps: string[] = [];

  // Summary
  const summary = `AI Learning System has processed ${metrics.totalNarrations} transactions with an acceptance rate of ${metrics.acceptanceRate.toFixed(1)}%. Monthly improvement: ${metrics.monthlyImprovement >= 0 ? '+' : ''}${metrics.monthlyImprovement.toFixed(1)}%.`;

  // Highlights
  if (metrics.acceptanceRate >= 80) {
    highlights.push(`Excellent acceptance rate of ${metrics.acceptanceRate.toFixed(1)}%`);
  }
  if (metrics.monthlyImprovement > 5) {
    highlights.push(`Strong monthly improvement of ${metrics.monthlyImprovement.toFixed(1)}%`);
  }
  if (metrics.averageConfidence >= 80) {
    highlights.push(`High average confidence of ${metrics.averageConfidence.toFixed(1)}%`);
  }

  // Concerns
  if (metrics.acceptanceRate < 60) {
    concerns.push(`Low acceptance rate of ${metrics.acceptanceRate.toFixed(1)}% - more training needed`);
  }
  if (metrics.monthlyImprovement < 0) {
    concerns.push(`Declining accuracy - review recent changes`);
  }

  // Next steps
  const recommendations = getLearningRecommendations(metrics);
  recommendations.slice(0, 3).forEach((rec) => {
    nextSteps.push(rec.action);
  });

  return {
    summary,
    highlights,
    concerns,
    nextSteps,
  };
}
