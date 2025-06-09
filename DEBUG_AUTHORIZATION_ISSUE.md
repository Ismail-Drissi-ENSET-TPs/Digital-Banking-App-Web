# 🔧 Guide de Dépannage - Problème d'Autorisation

## Problème Identifié
```
Http failure response for http://localhost:8020/customers/search?k=: 401 OK
```

## 🔍 Étapes de Diagnostic

### 1. Vérifier l'État d'Authentification

Ouvrez la console du navigateur (F12) et exécutez :

```javascript
// Vérifier si l'utilisateur est connecté
console.log('Authenticated:', angular.injector.get('AuthService').isAuthenticated);

// Vérifier si le token existe
console.log('Token:', angular.injector.get('AuthService').getAccessToken());

// Vérifier l'URL de l'API
console.log('API URL:', angular.injector.get('AuthService').getApiUrl());
```

### 2. Utiliser le Composant de Test

1. Naviguez vers `/admin/test-interceptor`
2. Vérifiez l'état d'authentification affiché
3. Cliquez sur "Test Recherche Clients"
4. Observez les logs dans la console

### 3. Vérifier les Logs de l'Intercepteur

Avec `DEBUG_MODE = true`, vous devriez voir dans la console :

```
🔍 URL Analysis for: http://localhost:8020/customers/search?k=
   API URL: http://localhost:8020
   Is Our API URL: true
   Is Public: false
   Is Asset: false
   Is External: false
   Is Relative API Call: false
```

### 4. Vérifier les En-têtes HTTP

1. Ouvrez l'onglet Network dans les outils de développement
2. Effectuez une requête de recherche de clients
3. Cliquez sur la requête `customers/search?k=`
4. Vérifiez la section "Request Headers"
5. Cherchez : `Authorization: Bearer [votre-token]`

## 🛠️ Solutions Possibles

### Solution 1: Vérifier la Connexion

Si l'utilisateur n'est pas connecté :
```typescript
// Se connecter d'abord
this.authService.login(username, password).subscribe(response => {
  this.authService.loadProfile(response);
  // Puis faire la requête
});
```

### Solution 2: Forcer l'Ajout de l'En-tête

Si l'intercepteur ne fonctionne pas, ajout manuel temporaire :
```typescript
// Dans customer.service.ts
public searchCustomers(keyword: string = ""): Observable<Array<Customer>> {
  const token = this.authService.getAccessToken();
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  return this.http.get<Array<Customer>>(
    `${this.apiUrl}/customers/search?k=${keyword}`,
    { headers }
  );
}
```

### Solution 3: Vérifier la Configuration de l'API

Vérifiez que l'URL de l'API est correcte :
```typescript
// Dans la console
console.log('Config:', angular.injector.get('ConfigService').backendHost);
```

### Solution 4: Redémarrer l'Application

Parfois, un simple redémarrage résout les problèmes de cache :
```bash
npm run build
npm start
```

## 🧪 Tests Manuels

### Test 1: Vérification du Token
```javascript
const authService = angular.injector.get('AuthService');
const token = authService.getAccessToken();
console.log('Token exists:', !!token);
console.log('Token value:', token);
```

### Test 2: Test de Requête Manuelle
```javascript
const http = angular.injector.get('HttpClient');
const authService = angular.injector.get('AuthService');

// Requête avec en-tête manuel
http.get('http://localhost:8020/customers', {
  headers: {
    'Authorization': `Bearer ${authService.getAccessToken()}`
  }
}).subscribe(
  data => console.log('Success:', data),
  error => console.log('Error:', error)
);
```

### Test 3: Vérification de l'Intercepteur
```javascript
// Vérifier si l'intercepteur est configuré
console.log('Interceptors configured in app.config.ts');
```

## 📋 Checklist de Vérification

- [ ] L'utilisateur est-il connecté ? (`authService.isAuthenticated`)
- [ ] Le token existe-t-il ? (`authService.getAccessToken()`)
- [ ] L'URL de l'API est-elle correcte ? (`authService.getApiUrl()`)
- [ ] L'intercepteur est-il configuré dans `app.config.ts` ?
- [ ] Les logs de debug apparaissent-ils dans la console ?
- [ ] L'en-tête `Authorization` apparaît-il dans l'onglet Network ?

## 🚨 Actions Immédiates

1. **Ouvrez la console du navigateur**
2. **Naviguez vers `/admin/test-interceptor`**
3. **Cliquez sur "Test Recherche Clients"**
4. **Vérifiez les logs dans la console**
5. **Vérifiez l'onglet Network pour les en-têtes HTTP**

## 📞 Si le Problème Persiste

Si après ces vérifications le problème persiste :

1. Copiez tous les logs de la console
2. Faites une capture d'écran de l'onglet Network
3. Vérifiez le statut d'authentification affiché dans le composant de test

Le problème est probablement lié à :
- Token expiré ou invalide
- Configuration incorrecte de l'intercepteur
- Problème de timing dans le chargement des services
