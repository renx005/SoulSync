import React from 'react';
export function MoodLegend() {
  const moodColors = [{
    label: 'Amazing',
    color: 'bg-green-400'
  }, {
    label: 'Good',
    color: 'bg-green-300'
  }, {
    label: 'Peaceful',
    color: 'bg-green-200'
  }, {
    label: 'Calm',
    color: 'bg-blue-200'
  }, {
    label: 'Energetic',
    color: 'bg-amber-300'
  }, {
    label: 'Okay',
    color: 'bg-blue-300'
  }, {
    label: 'Tired',
    color: 'bg-gray-300'
  }, {
    label: 'Stressed',
    color: 'bg-orange-200'
  }, {
    label: 'Anxious',
    color: 'bg-indigo-300'
  }, {
    label: 'Sad',
    color: 'bg-orange-300'
  }, {
    label: 'Angry',
    color: 'bg-red-400'
  }, {
    label: 'Awful',
    color: 'bg-red-300'
  }];
  return <div className="mt-4">
      <div className="flex flex-wrap gap-2 text-xs mx-[15px]">
        {moodColors.map(mood => <div key={mood.label} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${mood.color}`}></div>
            <span>{mood.label}</span>
          </div>)}
      </div>
    </div>;
}