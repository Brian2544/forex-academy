# ✅ Pre-Push Checklist - GitHub Safety Guide

## 🔒 Critical: Never Push These Files!

Before pushing to GitHub, make sure these sensitive files are **NOT** in your commit:

### ❌ Files That Should NEVER Be Committed:

1. **`.env` files** - Contains database passwords, API keys, secrets
   - ✅ Should be in `.gitignore`
   - ✅ Use `.env.example` as a template instead

2. **`node_modules/`** - Dependencies (too large, regenerated with `npm install`)
   - ✅ Should be in `.gitignore`

3. **`.env.backup`** - Backup files with sensitive data
   - ✅ Should be in `.gitignore`

4. **Database connection strings with passwords**
   - ✅ Should only be in `.env` (which is ignored)

---

## ✅ How to Verify Before Pushing

### Step 1: Check What Will Be Committed

```bash
cd forex-academy
git status
```

**Look for:**
- ❌ Any `.env` files
- ❌ `node_modules/` directories
- ❌ Files with passwords or API keys
- ❌ `.env.backup` files

### Step 2: Check .gitignore is Working

```bash
# This should show NO .env files
git status --ignored | grep .env
```

If you see `.env` files listed, they're being tracked and you need to remove them:

```bash
# Remove .env from git tracking (but keep the file locally)
git rm --cached backend/.env
git rm --cached web/.env
git rm --cached mobile/.env
```

### Step 3: Review Your Changes

```bash
# See what files will be committed
git diff --cached --name-only

# Or if not staged yet
git status
```

**Safe to commit:**
- ✅ Source code files (`.js`, `.jsx`, `.ts`, `.tsx`, etc.)
- ✅ Configuration files (`.json`, `.yaml`, etc.) - **EXCEPT** if they contain secrets
- ✅ Documentation (`.md` files)
- ✅ `.env.example` files (templates without real secrets)

**NOT safe to commit:**
- ❌ Any file with actual passwords, API keys, or secrets
- ❌ `.env` files with real credentials
- ❌ Database connection strings with passwords

---

## 🚀 Safe Push Process

### 1. Initialize Git (if not already done)

```bash
cd forex-academy
git init
```

### 2. Add Files (gitignore will automatically exclude sensitive files)

```bash
git add .
```

### 3. Verify What's Being Added

```bash
git status
```

**Double-check:**
- No `.env` files
- No `node_modules/`
- No backup files

### 4. Commit

```bash
git commit -m "Initial commit: Forex Academy project"
```

### 5. Add Remote and Push

```bash
# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
# or
git push -u origin master
```

---

## 📝 What's Protected by .gitignore

Your `.gitignore` files are configured to automatically exclude:

✅ **Backend (`backend/.gitignore`):**
- `node_modules/`
- All `.env` files (except `.env.example`)
- Log files
- Build directories
- Prisma migrations (optional)
- OS/Editor files
- Backup files

✅ **Root (`.gitignore`):**
- All environment files
- Node modules
- Build artifacts
- IDE files
- OS files

---

## 🆘 If You Accidentally Committed Sensitive Files

### Remove from Git History:

```bash
# Remove file from git but keep locally
git rm --cached backend/.env

# Commit the removal
git commit -m "Remove sensitive .env file"

# If already pushed, you'll need to force push (be careful!)
git push origin main --force
```

**⚠️ Warning:** If you've already pushed sensitive data:
1. **Immediately** change all passwords/API keys in that file
2. Consider the repository compromised
3. Use `git filter-branch` or BFG Repo-Cleaner to remove from history
4. Force push (notify collaborators first!)

---

## ✅ Final Checklist Before Push

- [ ] Ran `git status` and verified no `.env` files
- [ ] Verified no `node_modules/` in commit
- [ ] Checked no passwords/API keys in code files
- [ ] `.env.example` files exist (without real secrets)
- [ ] All sensitive data is in `.env` files (which are ignored)
- [ ] Ready to push!

---

## 🎉 You're Safe to Push!

Once you've verified everything above, you can safely push to GitHub. Your `.gitignore` files will automatically protect sensitive information.

