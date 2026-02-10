import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Box, Server, Cpu, Zap, RotateCcw } from 'lucide-react';
import ChaosControl from './ChaosControl';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [health, setHealth] = useState(null);
  const [requests, setRequests] = useState(0);
  const [metricsHistory, setMetricsHistory] = useState([]);
  
  const fetchHealth = async () => {
    try {
      const res = await axios.get('/health');
      setHealth(res.data);
      setRequests(prev => prev + 1);
      
      // Simulate tracking metrics over time for chart
      setMetricsHistory(prev => {
        const newHistory = [...prev, { time: new Date().toLocaleTimeString(), memory: parseInt(res.data.memory.used) }];
        return newHistory.slice(-20); // Keep last 20 points
      });

    } catch (err) {
      console.error("Health check failed", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchHealth, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="bg-indigo-600 p-3 rounded-xl"
            >
                <Server size={32} />
            </motion.div>
            <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-600">
                    Anti-Gravity Platform
                </h1>
                <p className="text-gray-400">DevOps Reliability • Self-Healing Infrastructure</p>
            </div>
        </div>
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${health ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <div className={`w-2 h-2 rounded-full ${health ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            {health ? 'System Online' : 'Connecting...'}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<Cpu />} label="Memory" value={health ? health.memory.used : '-'} color="purple" />
        <StatCard icon={<Shield />} label="Survivors" value={health ? health.survivorCount : '-'} color="green" />
        <StatCard icon={<Activity />} label="Requests" value={requests} color="blue" />
        <StatCard icon={<Box />} label="Pod Hostname" value={health ? health.hostname : '-'} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-gray-800/50 rounded-2xl p-6 border border-gray-700 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap className="text-yellow-400" /> Live Resource Usage
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metricsHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                        <Line type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Chaos Control */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 backdrop-blur-sm">
            <ChaosControl />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gray-800/50 p-6 rounded-2xl border border-gray-700 relative overflow-hidden group hover:border-${color}-500/50 transition-colors`}
    >
        <div className={`text-${color}-400 mb-4`}>{icon}</div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
        <div className={`absolute -right-4 -bottom-4 opacity-10 text-${color}-500 group-hover:scale-110 transition-transform`}>
            {React.cloneElement(icon, { size: 64 })}
        </div>
    </motion.div>
);

export default Dashboard;
