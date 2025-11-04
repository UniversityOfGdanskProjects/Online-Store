# Online-Store

Projekt typu **sklep internetowy** stworzony przez [MaGawlik2004](https://github.com/MaGawlik2004) w ramach zajęć Uniwersytetu Gdańskiego.  
Aplikacja łączy frontend (React / JS / CSS) z backendem (Python / FastAPI i Flask), tworząc pełnoprawny system e-commerce.

---

## Opis projektu

**Online-Store** to aplikacja webowa, która umożliwia użytkownikom przeglądanie produktów, dodawanie ich do koszyka oraz składanie zamówień.  
Celem projektu było zaprojektowanie architektury sklepu internetowego z prostym interfejsem użytkownika oraz zintegrowanym zapleczem (backendem) obsługującym dane produktów i transakcje.

---

## Funkcjonalności
- System logowania się dla administratorów
- System logowania sie oraz rejestracji dla użytkowników
- Dodawanie produktów, kategorii i kontrola stanu oraz zamówień
- Wyświetlanie listy produktów z możliwością filtrowania i wyszukiwania  
- Dodawanie produktów do koszyka i usuwanie z koszyka  
- Składanie zamówienia i podsumowanie zakupów  
- Interfejs webowy stworzony w Next.js
- Backend w Pythonie

---

## 🧩 Technologie

| Warstwa       | Technologia / narzędzie |
|----------------|--------------------------|
| Frontend       | Next.js, JavaScript, CSS |
| Backend        | Python (FastAPI / Flask)|
| Baza danych    | SQLite / PostgreSQL |
| DevOps         | Docker |
| Inne           | REST API |

---

## Instalacja i uruchomienie

### 1️⃣ Klonowanie repozytorium
```bash
git clone https://github.com/UniversityOfGdanskProjects/Online-Store.git
cd Online-Store
```

### 2️⃣ Uruchomienie backendu
```bash
cd backend
# Dla Pythona
pip install -r requirements.txt
python app.py

# lub dla Node.js
npm install
npm run dev
```

### 3️⃣ Uruchomienie frontendu
```bash
cd frontend
npm install
npm start
```

Aplikacja powinna być dostępna pod adresem:
```
http://localhost:3000
```

---

## Struktura katalogów

```
Online-Store/
│
├── backend/            # Logika serwera, API produktów i obsługa zamówień
├── frontend/           # Interfejs użytkownika (React / JS / CSS)
├── Hearth_And_Home.db  # Plik bazy danych SQLite
├── .github/            # Konfiguracja GitHub Actions
├── README.md           # Ten plik 🙂
└── .DS_Store           # Plik systemowy macOS
```

---


## 🙌 Autor

Projekt stworzony przez **[MaGawlik2004](https://github.com/MaGawlik2004)** w ramach **University of Gdańsk Projects**.  
Repozytorium: [Online-Store](https://github.com/UniversityOfGdanskProjects/Online-Store)  

