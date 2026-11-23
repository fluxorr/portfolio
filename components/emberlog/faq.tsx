import { frequentQuestions } from "@/lib/emberlog";

export function Faq() {
  return (
    <div className="el-faq-items">
      {frequentQuestions.map(({ question, answer }, index) => (
        <details key={question} name="emberlog-faq" open={index === 0}>
          <summary>
            <span className="el-faq-number">0{index + 1}</span>
            <span>{question}</span>
            <i aria-hidden="true" />
          </summary>
          <div>
            <p>{answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
