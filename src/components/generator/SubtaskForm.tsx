import React, { useState } from 'react';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import { VERTICALS, CREATIVE_STRATEGISTS, PLATFORMS } from '../../constants/dropdowns';
import { useDeepSeek } from '../../services/useDeepSeek';
import type { FormEvent } from 'react';
import type { SubtaskOutput, FormErrors } from '../../types/subtask.types';

interface SubtaskFormProps {
  onGenerate: (data: SubtaskOutput[]) => void;
}

type SubtaskPairingMode = 'sameBodyDifferentHook' | 'sameHookDifferentBody';

const SubtaskForm: React.FC<SubtaskFormProps> = ({ onGenerate }) => {
  const [vertical, setVertical] = useState<string>('');
  const [strategist, setStrategist] = useState<string>('');
  const [platform, setPlatform] = useState<string>('');
  const [subtaskCountInput, setSubtaskCountInput] = useState<string>('1');
  const [pairingMode, setPairingMode] = useState<SubtaskPairingMode>('sameBodyDifferentHook');
  const { generateIds, loading, error: apiError } = useDeepSeek();
  const [errors, setErrors] = useState<FormErrors>({});

  const parsedSubtaskCount = Number.parseInt(subtaskCountInput, 10);
  const shouldShowPairingMode = Number.isInteger(parsedSubtaskCount) && parsedSubtaskCount >= 2;

  const applyPairingMode = (idsList: SubtaskOutput[], mode: SubtaskPairingMode): SubtaskOutput[] => {
    if (idsList.length < 2) {
      return idsList;
    }

    const [first] = idsList;

    if (mode === 'sameBodyDifferentHook') {
      return idsList.map((item) => ({
        ...item,
        bsid: first.bsid,
        bvid: first.bvid
      }));
    }

    return idsList.map((item) => ({
      ...item,
      hsid: first.hsid,
      hvid: first.hvid
    }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!vertical) newErrors.vertical = 'Please select a vertical';
    if (!strategist) newErrors.strategist = 'Please select a strategist';
    if (!platform) newErrors.platform = 'Please select a platform';
    if (!Number.isInteger(parsedSubtaskCount) || parsedSubtaskCount < 1) {
      newErrors.subtaskCount = 'Please enter a valid number (minimum 1)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const generatedIds = await generateIds(['bsid', 'bvid', 'hsid', 'hvid'], parsedSubtaskCount);
      const generatedSubtasks: SubtaskOutput[] = generatedIds.map((ids) => ({
        vertical,
        strategist,
        platform,
        ...ids
      }));

      onGenerate(applyPairingMode(generatedSubtasks, pairingMode));
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const handleSubtaskCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubtaskCountInput(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Dropdown
          label="Vertical"
          options={VERTICALS}
          value={vertical}
          onChange={setVertical}
          error={errors.vertical}
        />
        <Dropdown
          label="Creative Strategist"
          options={CREATIVE_STRATEGISTS}
          value={strategist}
          onChange={setStrategist}
          error={errors.strategist}
        />
        <Dropdown
          label="Platform to Upload"
          options={PLATFORMS}
          value={platform}
          onChange={setPlatform}
          error={errors.platform}
        />
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Subtask IDs
        </label>
        <input
          type="number"
          min={1}
          step={1}
          value={subtaskCountInput}
          onChange={handleSubtaskCountChange}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.subtaskCount ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-gray-900'
          } focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white text-gray-900`}
        />
        {errors.subtaskCount && <p className="mt-1 text-sm text-red-500">{errors.subtaskCount}</p>}
      </div>

      {shouldShowPairingMode && (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtask Pairing Mode
          </label>
          <div className="space-y-2">
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="pairingMode"
                value="sameBodyDifferentHook"
                checked={pairingMode === 'sameBodyDifferentHook'}
                onChange={() => setPairingMode('sameBodyDifferentHook')}
                className="mt-1"
              />
              <span>Same body script/body visual, different hook script/hook visual</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="pairingMode"
                value="sameHookDifferentBody"
                checked={pairingMode === 'sameHookDifferentBody'}
                onChange={() => setPairingMode('sameHookDifferentBody')}
                className="mt-1"
              />
              <span>Same hook script/hook visual, different body script/body visual</span>
            </label>
          </div>
        </div>
      )}
      
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {apiError}
        </div>
      )}
      
      <Button type="submit" loading={loading} className="w-full">
        Generate Subtask IDs
      </Button>
    </form>
  );
};

export default SubtaskForm;