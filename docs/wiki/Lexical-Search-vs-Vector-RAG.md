# 🔍 Lexical Search vs. Vector RAG

A core architectural philosophy of LangFlow is: **No Vector Database Bloat for Language Acquisition**.

---

## 🚫 The Problem with Vector Embeddings in Linguistics

Vector embeddings map words to generalized semantic clusters. In language learning, this creates critical failure modes:
1. **False Friends**: Words with completely different meanings but similar context distributions (e.g. Bulgarian *гора* = forest vs. Ukrainian/Russian *гора* = mountain) get lumped together.
2. **Aspect Inaccuracy**: Imperfective and perfective verb pairs (*свиквам* vs. *свикна*) must be indexed by exact morphological lemma, not generic concept clusters.
3. **High Latency & Operational Cost**: External vector databases add unnecessary recurring costs ($/month) and cold-start latency.

---

## ✅ The PostgreSQL `tsvector` Solution

PostgreSQL native **Full-Text Search (`tsvector`)** with GIN indexing provides:
- **Sub-50ms Search Latency**: Instant full-text lookups across tens of thousands of sentences.
- **Exact Morphological Root Matching**: Deterministic lexical search across Bulgarian and Slavic roots.
- **$0.00 Operational Overhead**: Runs directly within the serverless Neon PostgreSQL instance.
