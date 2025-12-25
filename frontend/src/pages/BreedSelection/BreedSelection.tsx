import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface BreedComponent {
  id: string;
  breed: string;
  percentage: string;
}

type BreedOption = { type_name: string; id: number };
type ExistingPick = { type_name: string; pct: number };

export function BreedSelection() {
  const [components, setComponents] = useState<BreedComponent[]>([
    { id: '1', breed: '', percentage: '' },
  ]);

  const [breedOptions, setBreedOptions] = useState<BreedOption[]>([]);
  const [existingPrediction, setExistingPrediction] = useState<ExistingPick[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchBreedTypes();
    fetchExistingPrediction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate]);

  const fetchBreedTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('breed_type')
        .select('type_name, id')
        .order('type_name', { ascending: true });

      if (error) {
        console.error('Error fetching breed types:', error);
        return;
      }

      const breeds: BreedOption[] =
        (data ?? [])
          .filter((row: any) => row?.type_name && typeof row?.id === 'number')
          .map((row: any) => ({ type_name: row.type_name, id: row.id }));

      setBreedOptions(breeds);
    } catch (error) {
      console.error('Error fetching breed types:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExistingPrediction = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select(
          `
          id,
          prediction_picks (
            pct,
            breed_type (
              type_name
            )
          )
        `
        )
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching existing prediction:', error);
        setExistingPrediction(null);
        return;
      }

      if (!data) {
        setExistingPrediction(null);
        return;
      }

      const picks: ExistingPick[] =
        (data.prediction_picks ?? [])
          .filter((p: any) => p?.breed_type?.type_name != null)
          .map((p: any) => ({
            type_name: p.breed_type.type_name,
            pct: Number(p.pct),
          }))
          .filter((p: ExistingPick) => Number.isFinite(p.pct));

      setExistingPrediction(picks);
    } catch (err) {
      console.error('Error fetching existing prediction:', err);
      setExistingPrediction(null);
    }
  };

  const addComponent = () => {
    const newId = Date.now().toString();
    setComponents(prev => [...prev, { id: newId, breed: '', percentage: '' }]);
  };

  const deleteComponent = (id: string) => {
    setComponents(prev => (prev.length > 1 ? prev.filter(comp => comp.id !== id) : prev));
  };

  const updateComponent = (id: string, field: 'breed' | 'percentage', value: string) => {
    setComponents(prev =>
      prev.map(comp => (comp.id === id ? { ...comp, [field]: value } : comp))
    );
  };

  const totalPercentage = components.reduce((sum, comp) => {
    const pct = parseInt(comp.percentage, 10);
    return sum + (Number.isFinite(pct) ? pct : 0);
  }, 0);

  const allBreedsSelected = components.every(comp => comp.breed && comp.breed.trim() !== '');
  const isValid = totalPercentage === 100 && allBreedsSelected;

  const handleSubmit = async () => {
    if (!isValid) return;

    const validComponents = components.filter(comp => comp.breed && comp.percentage);

    const picksWithIds = validComponents.map(comp => {
      const opt = breedOptions.find(b => b.type_name === comp.breed);
      return {
        type_id: opt?.id,
        pct: parseInt(comp.percentage, 10),
      };
    });

    const picksForRpc = picksWithIds.filter(
      (p): p is { type_id: number; pct: number } =>
        typeof p.type_id === 'number' && Number.isFinite(p.pct)
    );

    const ids = picksForRpc.map(p => p.type_id);
    if (new Set(ids).size !== ids.length) {
      alert("Please don't select the same breed twice.");
      return;
    }

    try {
      const { data, error } = await supabase.rpc('submit_prediction', {
        picks: picksForRpc,
      });

      if (error) {
        console.error('Error submitting prediction:', error);
        alert('Error submitting prediction: ' + error.message);
      } else {
        console.log('Prediction submitted successfully:', data);
        await fetchExistingPrediction(); // refresh panel
      }
    } catch (error: any) {
      console.error('Error submitting prediction:', error);
      alert('Error submitting prediction: ' + (error.message || 'Unknown error'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-4 text-center">
          What breed is Muffin?
        </h1>

        {existingPrediction && existingPrediction.length > 0 && (
          <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-indigo-900 mb-2">
              Your current prediction
            </h2>

            <ul className="space-y-1 text-sm text-indigo-800">
              {existingPrediction
                .slice()
                .sort((a, b) => b.pct - a.pct)
                .map((p) => (
                  <li key={p.type_name} className="flex justify-between">
                    <span>{p.type_name}</span>
                    <span className="font-medium">{p.pct}%</span>
                  </li>
                ))}
            </ul>

            <p className="mt-2 text-xs text-indigo-700">
              Submitting again will replace this prediction.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {components.map((component) => (
            <div key={component.id} className="bg-white rounded-lg p-3">
              <div className="flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1">
                  <label htmlFor={`breed-${component.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Breed
                  </label>
                  <select
                    id={`breed-${component.id}`}
                    value={component.breed}
                    onChange={(e) => updateComponent(component.id, 'breed', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a breed</option>
                    {breedOptions.map((breed) => (
                      <option key={breed.id} value={breed.type_name}>
                        {breed.type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label htmlFor={`percentage-${component.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Percentage
                  </label>
                  <div className="relative">
                    <input
                      id={`percentage-${component.id}`}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={component.percentage}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d+$/.test(value)) {
                          updateComponent(component.id, 'percentage', value);
                        }
                      }}
                      placeholder="0"
                      className="w-full px-2 py-1.5 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <span className="absolute right-3 top-1.5 text-gray-500 text-sm">%</span>
                  </div>
                </div>

                {components.length > 1 && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => deleteComponent(component.id)}
                      className="px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center gap-4">
          <button
            onClick={addComponent}
            className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
          >
            Add Breed
          </button>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 px-3 py-1.5">
              Total:{' '}
              <span className={`font-semibold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                {totalPercentage}%
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`px-4 py-1.5 rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isValid
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
