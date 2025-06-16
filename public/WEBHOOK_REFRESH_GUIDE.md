
# Guia de Refresh via Webhook

## Visão Geral
O sistema de auto refresh foi removido. Agora o dashboard funciona apenas com refresh manual ou via webhook externo (N8N, Zapier, etc.).

## Como Funciona

### 1. Refresh Manual
- Clique no botão "Sincronizar" no header do dashboard
- Ou use o botão de refresh na seção de status de conexão

### 2. Refresh via Webhook/N8N

#### Opção A: JavaScript (PostMessage)
```javascript
// De dentro de um iframe ou janela filha
window.parent.postMessage({ type: 'DASHBOARD_REFRESH' }, '*');

// De uma janela pai para iframe
document.getElementById('dashboard-iframe').contentWindow.postMessage(
  { type: 'DASHBOARD_REFRESH' }, 
  '*'
);
```

#### Opção B: Função Global
```javascript
// Chame esta função de qualquer lugar
window.triggerDashboardRefresh();
```

#### Opção C: HTTP Request + localStorage
```javascript
// Em um webhook ou script externo, defina a flag
localStorage.setItem('dashboard_refresh_pending', 'true');
// O dashboard verificará essa flag a cada 5 segundos
```

## Integração com N8N

### Cenário 1: N8N executando JavaScript
```javascript
// No N8N, use um nó "Code" com JavaScript
localStorage.setItem('dashboard_refresh_pending', 'true');
```

### Cenário 2: N8N via HTTP Request
```javascript
// Configure um endpoint que execute:
fetch('/trigger-refresh', {
  method: 'POST',
  body: JSON.stringify({ action: 'refresh' })
}).then(() => {
  window.triggerDashboardRefresh();
});
```

### Cenário 3: N8N com Webhook + PostMessage
```javascript
// Quando o webhook do N8N for chamado, execute:
window.postMessage({ type: 'DASHBOARD_REFRESH' }, '*');
```

## Exemplos Práticos

### 1. Refresh Automático via N8N (Recomendado)
```javascript
// Nó HTTP Request no N8N para o seu endpoint
// Endpoint responde com HTML que executa:
<script>
if (window.parent && window.parent.triggerDashboardRefresh) {
  window.parent.triggerDashboardRefresh();
} else if (window.triggerDashboardRefresh) {
  window.triggerDashboardRefresh();
}
</script>
```

### 2. Refresh Programado
```javascript
// Para refresh a cada X minutos (se necessário)
setInterval(() => {
  if (/* alguma condição */) {
    window.triggerDashboardRefresh();
  }
}, 300000); // 5 minutos
```

### 3. Refresh baseado em Evento
```javascript
// Quando algo específico acontecer
document.addEventListener('customEvent', () => {
  window.triggerDashboardRefresh();
});
```

## Logs e Debug

O dashboard registra todas as ações de refresh:
- `🔄 Refresh solicitado via webhook externo`
- `🔄 Atualização manual solicitada`
- `🔄 Refresh pendente detectado`
- `🔄 Flag de refresh webhook definida`

## Benefícios

1. **Performance**: Sem polling desnecessário
2. **Controle**: Refresh apenas quando necessário
3. **Flexibilidade**: Múltiplas formas de trigger
4. **Eficiência**: Menor uso de recursos
5. **Integração**: Fácil integração com sistemas externos

## Troubleshooting

- Verifique o console para logs de refresh
- Certifique-se de que a função `window.triggerDashboardRefresh` existe
- Para N8N, teste primeiro com `localStorage.setItem('dashboard_refresh_pending', 'true')`
- Use `window.postMessage` se estiver em contexto de iframe
