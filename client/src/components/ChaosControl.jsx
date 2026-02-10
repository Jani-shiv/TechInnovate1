import React, { useState } from 'react';
import { Skull, AlertTriangle, Play } from 'lucide-react';
import axios from 'axios';

const ChaosControl = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const triggerKill = async () => {
        setLoading(true);
        try {
            const res = await axios.post('/api/chaos/kill');
            setResult(`Chaos Initiated: ${res.data.status}`);
            // Reload page after a delay to show recovery
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        } catch (err) {
            setResult('Error triggering chaos');
        } finally {
            setLoading(false);
        }
    };

    const triggerLoad = async (duration) => {
        setLoading(true);
        try {
            const res = await axios.get(`/load?duration=${duration}`);
            setResult(`Load Test Complete: ${res.data.iterations} iterations`);
        } catch (err) {
            setResult('Error triggering load');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Skull className="text-red-500" /> Chaos Control
            </h3>
            
            <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle size={16} /> Gravity Simulator (CPU Load)
                    </h4>
                    <p className="text-xs text-gray-400 mb-4">Spike CPU to trigger HPA scaling</p>
                    
                    <div className="grid grid-cols-3 gap-2">
                        {[5, 10, 20].map(duration => (
                            <button
                                key={duration}
                                onClick={() => triggerLoad(duration)}
                                disabled={loading}
                                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors disabled:opacity-50"
                            >
                                {duration}s
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-gray-700/30 border border-gray-600 rounded-xl">
                    <h4 className="font-semibold text-gray-400 mb-2 flex items-center gap-2">
                        <Skull size={16} /> Kill Pod
                    </h4>
                    <p className="text-xs text-gray-500 mb-4">Terminates the current process (Container restart)</p>
                    <button
                        onClick={triggerKill}
                        disabled={loading}
                        className="w-full px-3 py-2 bg-gray-600 hover:bg-red-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                        Kill Application Process
                    </button>
                </div>
            </div>

            {loading && (
                <div className="mt-4 text-xs text-yellow-400 animate-pulse">Running simulations...</div>
            )}
            
            {result && (
                <div className="mt-4 p-3 bg-green-500/10 text-green-400 text-xs rounded-lg border border-green-500/20">
                    {result}
                </div>
            )}
        </div>
    );
};

export default ChaosControl;
