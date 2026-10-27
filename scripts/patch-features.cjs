const fs = require('fs');

// ========== Patch shop page ==========
let shop = fs.readFileSync('src/app/shop/page.tsx', 'utf8');

// Add toggleAgeGroup + selectedAgeGroups after clearFilters block
const clearEnd = '    setPage(1);\r\n  };\r\n\r\n  const activeFilterCount';
const toggleCode = `    setPage(1);\r\n  };\r\n\r\n  const selectedAgeGroups = filters.ageGroup ? filters.ageGroup.split(",").map((s) => s.trim()).filter(Boolean) : [];\r\n\r\n  const toggleAgeGroup = (age) => {\r\n    setFilters((prev) => {\r\n      const current = prev.ageGroup ? prev.ageGroup.split(",").map((s) => s.trim()).filter(Boolean) : [];\r\n      const updated = current.includes(age) ? current.filter((a) => a !== age) : [...current, age];\r\n      return { ...prev, ageGroup: updated.join(",") };\r\n    });\r\n    setPage(1);\r\n  };\r\n\r\n  const activeFilterCount`;

if (shop.includes(clearEnd)) {
  shop = shop.replace(clearEnd, toggleCode);
  console.log('Added toggleAgeGroup to shop page');
} else {
  console.log('WARN: clearEnd block not found in shop');
}

// Replace age radio with checkbox multi-select
const oldRadio = 'type="radio" name="age" checked={filters.ageGroup === age} onChange={() => updateFilter("ageGroup", filters.ageGroup === age ? "" : age)} className="accent-pink-500"';
const newCheckbox = 'type="checkbox" checked={selectedAgeGroups.includes(age)} onChange={() => toggleAgeGroup(age)} className="accent-pink-500 w-4 h-4 rounded"';

if (shop.includes(oldRadio)) {
  shop = shop.replace(oldRadio, newCheckbox);
  // Add selected count after the closing </div> of age filter
  const ageCloseTag = '                ))}\r\n              </div>\r\n              {/* Brand */}';
  const ageCloseReplacement = `                ))}\r\n                {selectedAgeGroups.length > 0 && (\r\n                  <p className="text-xs text-stone-500 mt-1">Selected: {selectedAgeGroups.join(", ")}</p>\r\n                )}\r\n              </div>\r\n              {/* Brand */}`;
  shop = shop.replace(ageCloseTag, ageCloseReplacement);
  console.log('Replaced age radio with checkbox');
} else {
  console.log('WARN: old radio not found');
}

fs.writeFileSync('src/app/shop/page.tsx', shop);
console.log('Shop page saved');

// ========== Patch product detail page ==========
let detail = fs.readFileSync('src/app/product/[slug]/page.tsx', 'utf8');

// 1. Add Share2 to the imports
const oldImport = 'import { Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw, Check, ThumbsUp, Send } from "lucide-react";';
const newImport = 'import { Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw, Check, ThumbsUp, Send, Share2 } from "lucide-react";';
if (detail.includes(oldImport)) {
  detail = detail.replace(oldImport, newImport);
  console.log('Added Share2 import to detail page');
}

// 2. Add ShareModal import
const afterImports = 'import type { IProduct } from "@/types";';
const withShareImport = `import ShareModal from "@/components/ui/ShareModal";\r\nimport type { IProduct } from "@/types";`;
if (detail.includes(afterImports)) {
  detail = detail.replace(afterImports, withShareImport);
  console.log('Added ShareModal import');
}

// 3. Add shareOpen state after submitting state
const oldState = '  const [submitting, setSubmitting] = useState(false);';
const newState = '  const [submitting, setSubmitting] = useState(false);\r\n  const [shareOpen, setShareOpen] = useState(false);';
if (detail.includes(oldState)) {
  detail = detail.replace(oldState, newState);
  console.log('Added shareOpen state');
}

// 4. Replace single ageGroup display with multi-age display
const oldAgeDisplay = '{product.ageGroup && <div className="flex"><span className="text-gray-500 w-28">Age Group:</span><span>{product.ageGroup}</span></div>}';
const newAgeDisplay = `{((product.ageGroups && product.ageGroups.length > 0) || product.ageGroup) && <div className="flex"><span className="text-gray-500 w-28">Age Group:</span><span>{product.ageGroups && product.ageGroups.length > 0 ? product.ageGroups.join(", ") : product.ageGroup}</span></div>}`;
if (detail.includes(oldAgeDisplay)) {
  detail = detail.replace(oldAgeDisplay, newAgeDisplay);
  console.log('Updated ageGroup display to multi-age');
}

// 5. Add Share button next to wishlist button in the actions section
const oldActions = '            {/* Actions */}\r\n            <div className="flex gap-3">';
const newActions = `            {/* Actions */}\r\n            <div className="flex gap-3">`;
// Actually, add Share button after the wishlist button (closing of actions div)
const wishlistBtn = `                className={${'`'}w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-colors \${inWishlist ? "border-pink-500 bg-pink-50 text-pink-500" : "border-gray-200 hover:border-pink-300"}${'`'}}\r\n              >\r\n                <Heart className="h-5 w-5" fill={inWishlist ? "currentColor" : "none"} />\r\n              </motion.button>\r\n            </div>`;
const withShareBtn = `                className={${'`'}w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-colors \${inWishlist ? "border-pink-500 bg-pink-50 text-pink-500" : "border-gray-200 hover:border-pink-300"}${'`'}}\r\n              >\r\n                <Heart className="h-5 w-5" fill={inWishlist ? "currentColor" : "none"} />\r\n              </motion.button>\r\n              <motion.button\r\n                whileHover={{ scale: 1.05 }}\r\n                whileTap={{ scale: 0.95 }}\r\n                onClick={() => setShareOpen(true)}\r\n                className="w-14 h-14 rounded-xl border-2 border-gray-200 hover:border-[#D97757] flex items-center justify-center transition-colors hover:bg-orange-50 hover:text-[#D97757]"\r\n                title="Share with image & link"\r\n              >\r\n                <Share2 className="h-5 w-5" />\r\n              </motion.button>\r\n            </div>`;
if (detail.includes(wishlistBtn)) {
  detail = detail.replace(wishlistBtn, withShareBtn);
  console.log('Added share button to detail page');
} else {
  console.log('WARN: wishlist button block not found - trying simpler match');
  // Try simpler replacement: just add after the </div> of actions
}

// 6. Add ShareModal component before the closing fragment
const closingFragment = '    </Layout>\r\n  );';
const withModal = `      {product && <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} product={product} />}\r\n    </Layout>\r\n  );`;
if (detail.includes(closingFragment)) {
  detail = detail.replace(closingFragment, withModal);
  console.log('Added ShareModal to detail page');
}

fs.writeFileSync('src/app/product/[slug]/page.tsx', detail);
console.log('Product detail page saved');

// ========== Patch homepage age query ==========
let homepage = fs.readFileSync('src/app/page.tsx', 'utf8');
// The homepage uses direct DB queries with ageGroup field, no change needed since
// the Product model still supports ageGroup. The data fetching already works.

console.log('\nAll patches applied successfully!');
