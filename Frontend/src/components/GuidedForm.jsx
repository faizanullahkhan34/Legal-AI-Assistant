import { useState } from "react";

export default function GuidedForm({ onSubmit }) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        category: "",
        issue: "",
        city: ""
    });

    return (
        <div className="card">
            {step === 1 && (
                <>
                    <h3>Select Issue Type</h3>
                    <select onChange={e => setData({ ...data, category: e.target.value })}>
                        <option>Employment</option>
                        <option>Police Issue</option>
                        <option>Property</option>
                        <option>Free Speech</option>
                    </select>
                    <button onClick={() => setStep(2)} className="btn-primary">Next →</button>
                </>
            )}

            {step === 2 && (
                <>
                    <h3>Describe Your Issue</h3>
                    <textarea onChange={e => setData({ ...data, issue: e.target.value })} />
                    <button onClick={() => setStep(3)} className="btn-primary">Next →</button>
                </>
            )}

            {step === 3 && (
                <>
                    <h3>Your City</h3>
                    <input onChange={e => setData({ ...data, city: e.target.value })} />
                    <button onClick={() => onSubmit(data)} className="btn-primary">Submit</button>
                </>
            )}
        </div>
    );
}
