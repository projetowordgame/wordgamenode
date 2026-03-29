# API de Análise de Quizz - Documentação

## Novos Endpoints Criados

### 1. Salvar Respostas Detalhadas do Usuário
**Endpoint:** `POST /quizzes/:quizzId/user-answers/:userId`

Responsável por registrar qual resposta o usuário escolheu em cada pergunta do quiz.

**Parâmetros:**
- `quizzId` (path) - ID do quizz
- `userId` (path) - ID do usuário/aluno

**Body (JSON):**
```json
{
  "userAnswers": [
    {
      "questionId": 1,
      "answerId": 3,
      "isCorrect": true,
      "timeSpentInSeconds": 15
    },
    {
      "questionId": 2,
      "answerId": 5,
      "isCorrect": false,
      "timeSpentInSeconds": 20
    }
  ]
}
```

**Response de Sucesso:**
```json
[
  {
    "id": 1,
    "userId": 10,
    "quizzId": 5,
    "questionId": 1,
    "answerId": 3,
    "isCorrect": true,
    "timeSpentInSeconds": 15,
    "createdAt": "2024-03-29T10:30:00"
  }
]
```

---

### 2. Obter Análise Completa de um Aluno no Quizz
**Endpoint:** `GET /quizzes/analytics/:quizzId/:userId`

Retorna todos os dados necessários para o dashboard de análise.

**Parâmetros:**
- `quizzId` (path) - ID do quizz
- `userId` (path) - ID do aluno

**Response de Sucesso:**
```json
{
  "playerName": "João Silva",
  "playerId": 10,
  "totalCorrect": 7,
  "totalIncorrect": 3,
  "totalQuestions": 10,
  "timeInSeconds": 245,
  "questions": [
    {
      "questionId": 1,
      "questionText": "Qual é a capital do Brasil?",
      "userAnswerId": 3,
      "userAnswerText": "Brasília",
      "isCorrect": true,
      "correctAnswerId": 3,
      "correctAnswerText": "Brasília"
    },
    {
      "questionId": 2,
      "questionText": "Qual é a maior montanha do mundo?",
      "userAnswerId": 7,
      "userAnswerText": "K2",
      "isCorrect": false,
      "correctAnswerId": 8,
      "correctAnswerText": "Monte Everest"
    }
  ]
}
```

---

## Como Funciona o Fluxo Completo

### 1. Aluno Completa o Quiz (Frontend)
O frontend coleta as respostas e envia para o backend.

### 2. Backend Salva as Respostas Detalhadas
```bash
POST /quizzes/5/user-answers/10
```

### 3. Backend Atualiza o Score Total
O endpoint existente `/quizzes/ranking/:quizzId` continua funcionando:
```bash
POST /quizzes/ranking/5
Body: { userId: 10, correctAnswers: 7, timeInSeconds: 245 }
```

### 4. Frontend Recupera Análise para Dashboard
```bash
GET /quizzes/analytics/5/10
```

---

## Exemplo de Integração (Frontend)

```javascript
// 1. Após aluno terminar o quiz
async function submitQuiz(quizzId, userId, answers) {
  // Processar respostas para enviar
  const userAnswers = answers.map(answer => ({
    questionId: answer.questionId,
    answerId: answer.selectedAnswerId,
    isCorrect: answer.isCorrect,
    timeSpentInSeconds: answer.timeSpent
  }));

  // Salvar respostas detalhadas
  await fetch(`/quizzes/${quizzId}/user-answers/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userAnswers })
  });

  // Atualizar score total (já existe)
  const totalCorrect = answers.filter(a => a.isCorrect).length;
  const totalTime = answers.reduce((sum, a) => sum + a.timeSpent, 0);

  await fetch(`/quizzes/ranking/${quizzId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      userId, 
      correctAnswers: totalCorrect, 
      timeInSeconds: totalTime
    })
  });
}

// 2. Ao abrir o dashboard de análise
async function loadAnalytics(quizzId, userId) {
  const response = await fetch(`/quizzes/analytics/${quizzId}/${userId}`);
  const analytics = await response.json();
  
  console.log(`Aluno: ${analytics.playerName}`);
  console.log(`Acertos: ${analytics.totalCorrect}/${analytics.totalQuestions}`);
  console.log(`Tempo: ${analytics.timeInSeconds}s`);
  
  // Renderizar questões com feedback
  analytics.questions.forEach(q => {
    console.log(`Q${q.questionId}: ${q.isCorrect ? '✅' : '❌'}`);
  });
}
```

---

## Banco de Dados

### Nova Tabela: `user_answer`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária |
| userId | INT | ID do usuário |
| quizzId | INT | ID do quizz |
| questionId | INT | ID da pergunta |
| answerId | INT | ID da resposta escolhida |
| isCorrect | BOOLEAN | Se a resposta está correta |
| timeSpentInSeconds | INT (nullable) | Tempo gasto na pergunta |
| createdAt | TIMESTAMP | Quando foi respondido |

---

## Observações Importantes

1. **Ao submeter o quiz**, você DEVE chamar ambos os endpoints:
   - `POST /quizzes/:quizzId/user-answers/:userId` (novo)
   - `POST /quizzes/ranking/:quizzId` (existente)

2. **Os dados da tabela `user_answer` são cascata**, ou seja:
   - Se um usuário for deletado, suas respostas são deletadas
   - Se um quizz for deletado, todas as respostas dele são deletadas

3. **Histórico**: Se o aluno responder o mesmo quizz duas vezes, as respostas antigas são automaticamente deletadas e substituídas pelas novas.

4. **Campos opcionais**: `timeSpentInSeconds` em cada resposta é opcional. Se não enviado, será salvo como 0.

---

## Próximos Passos (Sugestões)

1. Adicionar filtros no endpoint de análise (por data, por faixa de acertos, etc)
2. Criar endpoint para comparar múltiplos alunos no mesmo quiz
3. Criar endpoint para estatísticas gerais do quiz (questão mais acertada, mais errada, etc)
4. Adicionar autenticação/autorização (professor só vê análise do seu próprio quiz)
