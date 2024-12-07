exports.calculateFeedback = (firebaseResponse) => {
  let fillers_count = firebaseResponse.fillers_count;
  let confidence = firebaseResponse.confidence;
  let wpm = firebaseResponse.wpm;

  let feedback = "";

  // Fungsi untuk memilih ekspresi dinamis
  const getExpression = (type) => {
    const positiveExpressions = ["Great job!", "Fantastic!", "Excellent work!"];
    const negativeExpressions = ["Uh-oh", "Ouch", "Hmm, it seems..."];
    if (type === "positive") {
      return positiveExpressions[
        Math.floor(Math.random() * positiveExpressions.length)
      ];
    }
    return negativeExpressions[
      Math.floor(Math.random() * negativeExpressions.length)
    ];
  };

  // Feedback kecepatan bicara
  if (wpm < 130) {
    feedback += `Your speaking speed is too slow. Try to increase your pace slightly to keep your audience engaged. `;
  } else if (wpm > 160) {
    feedback += `Your speaking speed is too fast. Slowing down a bit will help your audience understand your message better. `;
  } else {
    feedback += `Your speaking speed is just right. `;
  }

  // Feedback confidence
  if (confidence >= 0.85) {
    feedback =
      `${getExpression(
        "positive"
      )} You are very confident in your presentation, which is fantastic! ` +
      feedback;
  } else if (confidence >= 0.5) {
    feedback =
      `${getExpression(
        "positive"
      )} Good effort! You are showing confidence in your presentation. ` +
      feedback;
  } else {
    feedback =
      `${getExpression(
        "negative"
      )} It seems you are struggling with confidence in your presentation. ` +
      feedback;
  }

  // Feedback filler words
  if (fillers_count >= 1) {
    feedback += `However, we noticed ${fillers_count} filler words in your presentation. Reducing them will improve your clarity. `;
  } else {
    feedback += `Great job avoiding filler words! `;
  }

  // Default feedback jika tidak ada kondisi yang cocok
  if (!feedback) {
    feedback = `Thank you for your presentation. Keep practicing and refining your skills!`;
  }

  console.log("Feedback generated:", feedback);

  return feedback;
};
