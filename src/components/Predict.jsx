import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"

const API_URL = "https://academicrecommendationapi-production.up.railway.app"

// Liste complète des matières
const ALL_SUBJECTS = [
  { value: "mathematiques", label: "Mathématiques" },
  { value: "physique", label: "Physique" },
  { value: "chimie", label: "Chimie" },
  { value: "biologie", label: "Biologie" },
  { value: "informatique", label: "Informatique" },
  { value: "francais", label: "Français" },
  { value: "arabe", label: "Arabe" },
  { value: "economie", label: "Économie" },
  { value: "histoire_geographie", label: "Histoire-Géographie" },
  { value: "philosophie", label: "Philosophie" },
]

export default function Predict() {
  const [grades, setGrades] = useState([])
  const [availableSubjects, setAvailableSubjects] = useState(ALL_SUBJECTS)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [showResult, setShowResult] = useState(false)

  // Vérifier si tous les champs sont remplis et valides
  const isFormComplete = grades.length === ALL_SUBJECTS.length && 
    grades.every(g => {
      const score = parseFloat(g.score)
      return g.score !== "" && !isNaN(score) && score >= 0 && score <= 20
    })

  const addGrade = () => {
    if (availableSubjects.length === 0) return
    
    const newId = String(Date.now())
    setGrades([...grades, { id: newId, score: "", subject: "" }])
  }

  const deleteGrade = (id) => {
    const gradeToDelete = grades.find(g => g.id === id)
    
    // Remettre la matière dans la liste disponible
    if (gradeToDelete.subject) {
      const subjectToRestore = ALL_SUBJECTS.find(s => s.value === gradeToDelete.subject)
      if (subjectToRestore) {
        setAvailableSubjects([...availableSubjects, subjectToRestore])
      }
    }
    
    setGrades(grades.filter((g) => g.id !== id))
  }

  const updateGrade = (id, field, value) => {
    if (field === "subject") {
      const previousGrade = grades.find(g => g.id === id)
      
      // Remettre l'ancienne matière dans la liste si elle existait
      if (previousGrade.subject) {
        const oldSubject = ALL_SUBJECTS.find(s => s.value === previousGrade.subject)
        if (oldSubject) {
          setAvailableSubjects([...availableSubjects, oldSubject])
        }
      }
      
      // Retirer la nouvelle matière de la liste disponible
      setAvailableSubjects(availableSubjects.filter(s => s.value !== value))
    }
    
    // Validation pour le score
    if (field === "score") {
      const numValue = parseFloat(value)
      // Accepter les valeurs vides ou entre 0 et 20
      if (value === "" || (numValue >= 0 && numValue <= 20)) {
        setGrades(grades.map((g) => (g.id === id ? { ...g, [field]: value } : g)))
      }
      return
    }
    
    setGrades(grades.map((g) => (g.id === id ? { ...g, [field]: value } : g)))
  }

  const handleSubmit = async () => {
    if (!isFormComplete) {
      alert("Veuillez remplir toutes les notes pour toutes les matières (entre 0 et 20)")
      return
    }

    setLoading(true)
    
    try {
      // Créer l'objet de données pour l'API
      const payload = {}
      grades.forEach(grade => {
        payload[grade.subject] = parseFloat(grade.score.replace(',', '.'))
      })

      console.log("Envoi des données:", payload)

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log("Résultat reçu:", data)
      
      setResult(data)
      setShowResult(true)
      
    } catch (error) {
      console.error('Erreur lors de la prédiction:', error)
      alert(`Erreur lors de la prédiction: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const closeResultModal = () => {
    setShowResult(false)
  }

  const resetForm = () => {
    setGrades([])
    setAvailableSubjects(ALL_SUBJECTS)
    setResult(null)
    setShowResult(false)
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Import your marks!</h1>
          {/* <Button variant="outline" className="w-fit bg-transparent">
            Import struct
          </Button> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Section - Grades Table */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              {/* Progress Indicator */}
              <div className="mb-4 p-3 bg-muted rounded">
                <p className="text-sm text-muted-foreground">
                  Matières remplies: <span className="font-bold text-foreground">{grades.length}/{ALL_SUBJECTS.length}</span>
                </p>
              </div>

              {/* Table Header */}
              {grades.length > 0 && (
                <div className="grid grid-cols-12 gap-4 mb-4 pb-4 border-b border-border">
                  <div className="col-span-5 font-semibold text-foreground">Matière</div>
                  <div className="col-span-4 font-semibold text-foreground">Note (/20)</div>
                  <div className="col-span-3 font-semibold text-foreground">Action</div>
                </div>
              )}

              {/* Table Body */}
              {grades.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {grades.map((grade) => {
                    const score = parseFloat(grade.score)
                    const isInvalidScore = grade.score !== "" && (isNaN(score) || score < 0 || score > 20)
                    
                    return (
                      <div key={grade.id} className="grid grid-cols-12 gap-4 items-center">
                        <select
                          value={grade.subject}
                          onChange={(e) => updateGrade(grade.id, "subject", e.target.value)}
                          className="col-span-5 px-3 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="">Sélectionner une matière</option>
                          {grade.subject && (
                            <option value={grade.subject}>
                              {ALL_SUBJECTS.find(s => s.value === grade.subject)?.label}
                            </option>
                          )}
                          {availableSubjects.map((subject) => (
                            <option key={subject.value} value={subject.value}>
                              {subject.label}
                            </option>
                          ))}
                        </select>
                        
                        <div className="col-span-4">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="20"
                            value={grade.score}
                            onChange={(e) => updateGrade(grade.id, "score", e.target.value)}
                            placeholder="0.00"
                            disabled={!grade.subject}
                            className={`w-full px-3 py-2 bg-input border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                              isInvalidScore 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-border focus:ring-primary/50'
                            }`}
                          />
                          {isInvalidScore && (
                            <p className="text-xs text-red-500 mt-1">Note entre 0 et 20</p>
                          )}
                        </div>
                        
                        <button
                          onClick={() => deleteGrade(grade.id)}
                          className="col-span-3 inline-flex items-center justify-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                          <span>Del</span>
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-2">Aucune matière ajoutée</p>
                  <p className="text-sm">Cliquez sur "Ajouter une matière" pour commencer</p>
                </div>
              )}

              {/* Add Button */}
              <button
                onClick={addGrade}
                disabled={availableSubjects.length === 0}
                className="w-full mb-6 px-4 py-2 bg-input border border-border rounded text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Ajouter une matière ({availableSubjects.length} restante{availableSubjects.length > 1 ? 's' : ''})
              </button>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit}
                disabled={!isFormComplete || loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  'Obtenir ma recommandation'
                )}
              </Button>

              {!isFormComplete && grades.length > 0 && (
                <p className="text-sm text-muted-foreground text-center mt-3">
                  {grades.length < ALL_SUBJECTS.length 
                    ? `Ajoutez encore ${ALL_SUBJECTS.length - grades.length} matière(s)` 
                    : 'Remplissez toutes les notes (entre 0 et 20) pour continuer'}
                </p>
              )}
            </div>
          </div>

          {/* Right Section - Features */}
          <div className="lg:col-span-1 space-y-6">
            {/* Features List */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-4">À propos</h3>
              <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Analyse vos notes et identifie vos points forts.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Recommande les filières les plus adaptées à votre profil.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Fournit un score de confiance pour chaque recommandation.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Basé sur un modèle d'apprentissage automatique entraîné.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal/Popup */}
      {showResult && result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg border border-border p-8 max-w-2xl w-full shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">🎓 Filière Recommandée</h2>
              <div className="w-20 h-1 bg-primary mx-auto rounded"></div>
            </div>

            <div className="bg-primary/10 rounded-lg p-6 mb-6">
              <p className="text-4xl font-bold text-primary text-center mb-3">
                {result.filiere_recommandee}
              </p>
              {result.probability && (
                <p className="text-center text-muted-foreground">
                  Confiance: <span className="font-bold text-foreground">{(result.probability * 100).toFixed(1)}%</span>
                </p>
              )}
            </div>

            {result.all_probabilities && (
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Autres filières possibles:</h3>
                <div className="space-y-2">
                  {Object.entries(result.all_probabilities)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([filiere, prob]) => (
                      <div key={filiere} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm text-foreground">{filiere}</span>
                        <span className="text-sm font-semibold text-primary">{(prob * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={resetForm}
                variant="outline"
                className="flex-1"
              >
                Nouvelle analyse
              </Button>
              <Button 
                onClick={closeResultModal}
                className="flex-1 bg-primary"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}