# 🧪 TESTING GUIDE

## Start Local Server

```bash
cd /Users/steve/Documents/Universita/diasite
python3 -m http.server 8000
```

Open: **http://localhost:8000**

---

## ✅ Test Checklist

### 1. Welcome Screen
- [ ] Page loads with purple gradient background
- [ ] "Willkommen" title visible
- [ ] "Wer bist du?" question visible
- [ ] Name input field works
- [ ] "Los geht's!" button disabled until name entered
- [ ] Language buttons (DE/RU) work
- [ ] Clicking RU changes text to Russian
- [ ] Enter key submits form

### 2. Welcome → Landing Transition
- [ ] After submitting name, welcome screen fades out
- [ ] Landing page appears with map background
- [ ] Klein-Dia dialogue appears: "Hey! Ich bin Klein-Dia..."
- [ ] Your sprite (jenSprite.png) shows in dialogue bubble

### 3. Landing Page
- [ ] Map background (map1.png) visible
- [ ] All 8 collectible emojis visible and floating
- [ ] Map hotspots (pink circles) visible
- [ ] Instructions panel (bottom left) shows uncollected items
- [ ] Inventory (bottom right) is empty initially
- [ ] "Press L to zoom" - hold L key activates magnifying glass

### 4. Navigation
- [ ] Click any map hotspot → navigates to that location
- [ ] Back button returns to landing page
- [ ] Arrow buttons work (if visible)
- [ ] Page transitions are smooth

### 5. Minigames
- [ ] Each location shows "Play" overlay
- [ ] Clicking "Play" starts game
- [ ] Winning adds item to inventory
- [ ] Item appears in inventory panel (bottom right)
- [ ] Flash message shows: "You won [item]!"

### 6. Inventory System
- [ ] Items appear as emojis
- [ ] Clicking item selects it (border appears)
- [ ] Uncollected list updates as you collect
- [ ] When all 8 collected: "✓ All collected!"

### 7. State Persistence
- [ ] Refresh page → name is remembered
- [ ] Refresh page → inventory is remembered
- [ ] Refresh page → visited locations remembered
- [ ] Auto-saves every 30 seconds

### 8. Language Switch
- [ ] Open browser console (F12)
- [ ] Type: `await i18n.switchLanguage('ru')`
- [ ] UI text changes to Russian
- [ ] Inventory labels change
- [ ] Messages change

---

## 🐛 Common Issues

### Issue: "Cannot use import statement"
**Fix:** Make sure you're using `http://localhost:8000` not `file://`

### Issue: Klein-Dia sprite not showing
**Check:** Is `jenSprite.png` in `/assets/sprites/`?
**Fallback:** Should show placeholder emoji

### Issue: White screen
**Check Console:** F12 → Console tab → look for errors
**Common:** File paths wrong, check all `/assets/` paths

### Issue: No dialogue appears
**Check:** Browser console for errors
**Check:** `jenSprite.png` exists
**Fallback:** Should still work with emoji

---

## 🎮 Test Game Flow

1. **First Visit:**
   - Enter name: "Test"
   - Select language: Deutsch
   - Click "Los geht's!"
   - See Klein-Dia welcome

2. **Explore:**
   - Click "snails" hotspot
   - Click "Play"
   - Play snail game
   - Win → get 🐌 snail in inventory

3. **Continue:**
   - Click "Back"
   - Visit 6 more locations
   - Collect 6 more items

4. **Home Unlock:**
   - After 7 locations visited
   - Klein-Dia says: "Puh... das war viel heute..."
   - Home hotspot should be unlocked (future feature)

5. **Persistence Test:**
   - Refresh page (F5)
   - Should skip welcome screen
   - Should keep inventory
   - Should remember visited locations

---

## 📊 Check Browser Console

Good signs:
```
🚀 Initializing Diasite...
✅ Language loaded: de
✅ Navigation initialized
✅ Inventory initialized
✅ Diasite initialized
```

Bad signs:
```
❌ Failed to load...
404 Not Found...
Cannot import...
```

---

## 🔧 Debug Commands

Open Console (F12) and try:

```javascript
// Check state
DiasiteState.player

// Add item manually
DiasiteInventory.addItem('snail')

// Navigate manually
DiasiteNavigation.navigateTo('snails')

// Show dialogue manually
Dialogue.show('klein_dia_intro')

// Switch language
await i18n.switchLanguage('ru')

// Export all data
Storage.exportAllData()
```

---

## ✅ Success Criteria

**Phase 1-2 is successful if:**
- ✅ Welcome screen works
- ✅ Name is saved
- ✅ Can navigate between locations
- ✅ Can play at least one minigame
- ✅ Inventory updates when winning
- ✅ Klein-Dia dialogues appear
- ✅ Language switch works
- ✅ Data persists after refresh

---

**Any issues? Let me know what's in the console!** 🚀
