import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function VotingApp() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalParticipants, setTotalParticipants] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [pessimistic, setPessimistic] = useState('');
  const [probable, setProbable] = useState('');
  const [optimistic, setOptimistic] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const createTask = () => {
    if (!title || !description || !totalParticipants) {
      setErrorMessage("Preencha todos os campos da tarefa.");
      return;
    }
    setErrorMessage('');
    const newTask = {
      id: Date.now(),
      title,
      description,
      totalParticipants: Number(totalParticipants),
      votes: [],
      estimatedDays: null,
      averages: null,
    };
    setTasks([...tasks, newTask]);
    setTitle('');
    setDescription('');
    setTotalParticipants('');
  };

  const vote = () => {
    if (!participantName || !pessimistic || !probable || !optimistic) {
      setErrorMessage("Preencha todos os campos da votação.");
      return;
    }
    const updatedTasks = tasks.map(task => {
      if (task.id === selectedTask.id) {
        const alreadyVoted = task.votes.find(v => v.participant.toLowerCase() === participantName.toLowerCase());
        if (alreadyVoted) {
          setErrorMessage("Você já votou nesta tarefa.");
          return task;
        }

        const newVote = {
          participant: participantName,
          pessimistic: Number(pessimistic),
          probable: Number(probable),
          optimistic: Number(optimistic),
        };
        task.votes.push(newVote);

        if (task.votes.length === task.totalParticipants) {
          const pessAvg = average(task.votes.map(v => v.pessimistic));
          const probAvg = average(task.votes.map(v => v.probable));
          const optAvg = average(task.votes.map(v => v.optimistic));
          task.estimatedDays = ((pessAvg + 4 * probAvg + optAvg) / 6).toFixed(2);
          task.averages = [
            { name: 'Pessimista', dias: pessAvg },
            { name: 'Mais provável', dias: probAvg },
            { name: 'Otimista', dias: optAvg },
          ];
        }
      }
      return task;
    });

    setTasks(updatedTasks);
    setParticipantName('');
    setPessimistic('');
    setProbable('');
    setOptimistic('');
    setSelectedTask(null);
    setErrorMessage('');
  };

  const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sistema de Votação - Estimativa PERT</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Criar nova tarefa</h2>
        <Input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} className="mb-2" />
        <Input placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} className="mb-2" />
        <Input type="number" placeholder="Número de participantes" value={totalParticipants} onChange={e => setTotalParticipants(e.target.value)} className="mb-2" />
        <Button onClick={createTask}>Criar</Button>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>

      <div className="grid gap-4">
        {tasks.map(task => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <h3 className="text-lg font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <p className="text-sm text-gray-600">Participantes: {task.votes.length} / {task.totalParticipants}</p>
              {task.estimatedDays ? (
                <>
                  <p className="mt-2 font-semibold text-green-700">Estimativa Final: {task.estimatedDays} dias</p>
                  {task.averages && (
                    <div className="h-48 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={task.averages}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="dias" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </>
              ) : (
                <Button className="mt-2" onClick={() => setSelectedTask(task)} disabled={task.votes.length >= task.totalParticipants}>
                  Votar
                </Button>
              )}

              {task.votes.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <strong>Votos:</strong>
                  <ul className="list-disc list-inside">
                    {task.votes.map((v, idx) => (
                      <li key={idx}>
                        {v.participant}: P={v.pessimistic}, M={v.probable}, O={v.optimistic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTask && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t">
          <h2 className="text-lg font-semibold">Votação: {selectedTask.title}</h2>
          <Input
            placeholder="Seu nome"
            value={participantName}
            onChange={e => setParticipantName(e.target.value)}
            className="my-2"
          />
          <Input
            type="number"
            placeholder="Dias pessimista"
            value={pessimistic}
            onChange={e => setPessimistic(e.target.value)}
            className="my-2"
          />
          <Input
            type="number"
            placeholder="Dias mais provável"
            value={probable}
            onChange={e => setProbable(e.target.value)}
            className="my-2"
          />
          <Input
            type="number"
            placeholder="Dias otimista"
            value={optimistic}
            onChange={e => setOptimistic(e.target.value)}
            className="my-2"
          />
          <Button onClick={vote}>Confirmar Voto</Button>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
      )}
    </div>
  );
}
