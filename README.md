# Vision Assistant

An assistive web app for blind and visually impaired people. Voice-first,
high contrast, screen-reader accessible, works on phone Chrome (HTTPS only).

> **Safety disclaimer**: This is an assistive tool, NOT a replacement for a
> cane, guide dog, or sighted assistant. Never rely on it for safety-critical
> decisions.

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** for accessible UI
- **Gemini Vision** or **Anthropic Claude** for image understanding
- **Nominatim** (OpenStreetMap) for geocoding
- **OSRM** for walking directions
- Deployed on **Vercel**

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and add your API key
cp .env.example .env.local
# Edit .env.local with your GEMINI_API_KEY or ANTHROPIC_API_KEY

# 3. Run dev server
npm run dev
```

---

## API Reference

All endpoints return JSON. Error responses use the shape `{ "error": "<code>" }`.

### POST /api/describe

Describe a scene or read text from a camera image.

**Request body** (JSON):
| Field   | Type                    | Required | Notes                                |
|---------|-------------------------|----------|--------------------------------------|
| `image` | `string`                | yes      | Base64-encoded JPEG, no `data:` prefix. Max ~3 MB. |
| `mode`  | `"describe" \| "read"`  | yes      | `describe` = scene, `read` = OCR     |
| `lang`  | `"en" \| "hi"`          | yes      | Response language                    |

**Responses**:
| Status | Body                        | When                          |
|--------|-----------------------------|-------------------------------|
| 200    | `{ "text": "..." }`        | Success                       |
| 400    | `{ "error": "bad_request" }`| Missing / invalid fields      |
| 429    | `{ "error": "busy" }`      | Rate limited or upstream 429  |
| 502    | `{ "error": "upstream" }`  | LLM call failed               |

**curl example**:
```bash
# Encode a test image
IMG=$(base64 -w0 test.jpg)

curl -X POST http://localhost:3000/api/describe \
  -H "Content-Type: application/json" \
  -d "{\"image\":\"$IMG\",\"mode\":\"describe\",\"lang\":\"en\"}"
```

---

### GET /api/geocode

Search for a place by name. Checks hardcoded demo spots first, then
Nominatim.

**Query params**:
| Param | Type     | Required | Notes                                |
|-------|----------|----------|--------------------------------------|
| `q`   | `string` | yes      | Search query (e.g. "canteen")        |
| `lat` | `number` | no       | User latitude for result bias        |
| `lon` | `number` | no       | User longitude for result bias       |

**Responses**:
| Status | Body                                          |
|--------|-----------------------------------------------|
| 200    | `{ "lat": 28.61, "lon": 77.20, "name": "..." }` |
| 400    | `{ "error": "bad_request" }`                  |
| 404    | `{ "error": "not_found" }`                    |
| 429    | `{ "error": "busy" }`                         |
| 502    | `{ "error": "upstream" }`                     |

**curl example**:
```bash
curl "http://localhost:3000/api/geocode?q=canteen&lat=28.61&lon=77.20"
```

---

### GET /api/route

Get walking directions between two points.

**Query params**:
| Param     | Type     | Required |
|-----------|----------|----------|
| `fromLat` | `number` | yes      |
| `fromLon` | `number` | yes      |
| `toLat`   | `number` | yes      |
| `toLon`   | `number` | yes      |

**Responses**:
| Status | Body |
|--------|------|
| 200    | `{ "distance": 450, "steps": [{ "type": "depart", "name": "Main Rd", "distance": 120, "lat": 28.61, "lon": 77.20 }, ...] }` |
| 400    | `{ "error": "bad_request" }` |
| 429    | `{ "error": "busy" }` |
| 502    | `{ "error": "upstream" }` |

**curl example**:
```bash
curl "http://localhost:3000/api/route?fromLat=28.6139&fromLon=77.2090&toLat=28.6145&toLon=77.2095"
```

---

### Rate Limits

- **Per IP**: 1 request every 3 seconds
- **Global**: 20 requests per minute

Exceeded limits return `429 { "error": "busy" }`.

---

## Branch Strategy

| Branch    | Owner   | Scope                                    |
|-----------|---------|------------------------------------------|
| `main`    | shared  | Stable merged code                       |
| `anirudh` | Anirudh | Backend: API routes, server libs, types  |
| `ayush`   | Ayush   | Frontend: pages, components, hooks       |

## Environment Variables

See [`.env.example`](.env.example) for all configurable values.
