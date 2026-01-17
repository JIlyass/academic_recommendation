import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Upload } from "lucide-react"

export default function Predict() {
  const [grades, setGrades] = useState([{ id: "1", score: "13,45", subject: "Math" }])

  const addGrade = () => {
    const newId = String(Math.max(...grades.map((g) => parseInt(g.id) || 0)) + 1)
    setGrades([...grades, { id: newId, score: "", subject: "" }])
  }

  const deleteGrade = (id) => {
    setGrades(grades.filter((g) => g.id !== id))
  }

  const updateGrade = (id, field, value) => {
    setGrades(grades.map((g) => (g.id === id ? { ...g, [field]: value } : g)))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add("border-primary/50", "bg-primary/5")
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("border-primary/50", "bg-primary/5")
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-primary/50", "bg-primary/5")
    // Handle file drop here
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">import your marks !</h1>
          <Button variant="outline" className="w-fit bg-transparent">
            Import struct
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Grades Table */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 mb-4 pb-4 border-b border-border">
                <div className="col-span-4 font-semibold text-foreground">Score</div>
                <div className="col-span-5 font-semibold text-foreground">Subject</div>
                <div className="col-span-3 font-semibold text-foreground">Add</div>
              </div>

              {/* Table Body */}
              <div className="space-y-3 mb-6">
                {grades.map((grade) => (
                  <div key={grade.id} className="grid grid-cols-12 gap-4 items-center">
                    <input
                      type="text"
                      value={grade.score}
                      onChange={(e) => updateGrade(grade.id, "score", e.target.value)}
                      placeholder="Enter score"
                      className="col-span-4 px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="text"
                      value={grade.subject}
                      onChange={(e) => updateGrade(grade.id, "subject", e.target.value)}
                      placeholder="Enter subject"
                      className="col-span-5 px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      onClick={() => deleteGrade(grade.id)}
                      className="col-span-3 inline-flex items-center justify-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Del</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Button */}
              <button
                onClick={addGrade}
                className="w-full mb-6 px-4 py-2 bg-input border border-border rounded text-foreground hover:bg-muted transition-colors"
              >
                + Add Subject
              </button>

              {/* Submit Button */}
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg rounded-lg">
                Submit
              </Button>
            </div>
          </div>

          {/* Right Section - Drag Drop & Features */}
          <div className="lg:col-span-1 space-y-6">
            {/* Drag Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-all duration-200 cursor-pointer hover:border-primary/50 bg-muted/30"
            >
              <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Drag Drop</h3>
              <p className="text-sm text-muted-foreground">Drop your files here</p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Analyzes student grades and performance patterns across subjects.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Matches academic strengths to suitable majors using rules + ML ranking.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Outputs top major recommendations with confidence scores.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Explains each recommendation based on key subjects and trends.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}