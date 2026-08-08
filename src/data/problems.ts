import type { Problem } from '../types/index';

export const INITIAL_PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    acceptanceRate: 0,
    solvedByCount: 0,
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your code here
  
}
`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Write your code here
  return [];
}
`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        pass
`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};
`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}
`
    },
    solutionTemplate: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        lookup = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in lookup:
                return [lookup[diff], i]
            lookup[num] = i
        return []`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int comp = target - nums[i];
            if (map.count(comp)) return {map[comp], i};
            map[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`
    },
    testcases: [
      {
        id: 1,
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        explanation: '2 + 7 = 9 at indices 0 and 1.'
      },
      {
        id: 2,
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1,2]',
        explanation: '2 + 4 = 6 at indices 1 and 2.'
      },
      {
        id: 3,
        input: 'nums = [3,3], target = 6',
        expectedOutput: '[0,1]',
        explanation: '3 + 3 = 6 at indices 0 and 1.'
      },
      {
        id: 4,
        input: 'nums = [-1,-2,-3,-4,-5], target = -8',
        expectedOutput: '[2,4]',
        isHidden: true,
        explanation: '-3 + (-5) = -8'
      },
      {
        id: 5,
        input: 'nums = [1000000000, 2, 4, -1000000000], target = 0',
        expectedOutput: '[0,3]',
        isHidden: true,
        explanation: 'Large numbers cancel out to target 0.'
      }
    ],
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers but that would be O(N^2). Can we do better?',
      'Can we use extra space like a Hash Map to store previously seen numbers and their indices in O(1) lookup time?',
      'As you iterate over the array, check if target - currentNum is already in your Hash Map.'
    ],
    editorial: {
      approach: 'Hash Map One-Pass Approach',
      intuition: 'Instead of checking every pair with nested loops (O(N^2)), we can store elements in a Hash Map as we iterate. For each element `x`, we look up whether `target - x` exists in the hash map. If it does, we have found our answer in O(1) average lookup time.',
      complexity: {
        time: 'O(N) - We traverse the list containing N elements exactly once. Each lookup in the hash map costs O(1).',
        space: 'O(N) - The extra space required depends on the number of items stored in the hash map, which stores at most N elements.'
      },
      codeSolution: {
        javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for idx, val in enumerate(nums):
            rem = target - val
            if rem in seen:
                return [seen[rem], idx]
            seen[val] = idx
        return []`,
        cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int comp = target - nums[i];
            if (seen.find(comp) != seen.end()) {
                return {seen[comp], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
        java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`
      }
    }
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    category: 'Two Pointers',
    acceptanceRate: 0,
    solvedByCount: 0,
    companies: ['Meta', 'Microsoft', 'AB Talk', 'Spotify'],
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` *if it is a **palindrome**, or* \`false\` *otherwise*.`,
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.'
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.'
      },
      {
        input: 's = " "',
        output: 'true',
        explanation: 's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.'
      }
    ],
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // Write your code here
  
}
`,
      typescript: `function isPalindrome(s: string): boolean {
  // Write your code here
  return false;
}
`,
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Write your code here
        pass
`,
      cpp: `#include <string>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        // Write your code here
        return false;
    }
};
`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        // Write your code here
        return false;
    }
}
`
    },
    solutionTemplate: {
      javascript: `function isPalindrome(s) {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = cleaned.length - 1;
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
      typescript: `function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = cleaned.length - 1;
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        cleaned = [c.lower() for c in s if c.isalnum()]
        return cleaned == cleaned[::-1]`,
      cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = s.size() - 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
        return true;
    }
};`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }
}`
    },
    testcases: [
      {
        id: 1,
        input: 's = "A man, a plan, a canal: Panama"',
        expectedOutput: 'true',
        explanation: 'Matches forward and backwards.'
      },
      {
        id: 2,
        input: 's = "race a car"',
        expectedOutput: 'false',
        explanation: 'Characters do not match in center.'
      },
      {
        id: 3,
        input: 's = " "',
        expectedOutput: 'true',
        explanation: 'Empty cleaned string is palindrome.'
      },
      {
        id: 4,
        input: 's = "0P"',
        expectedOutput: 'false',
        isHidden: true,
        explanation: '0 and P are alphanumeric and not equal.'
      },
      {
        id: 5,
        input: 's = "ab_a"',
        expectedOutput: 'true',
        isHidden: true,
        explanation: 'Ignoring underscores, "aba" is a palindrome.'
      }
    ],
    hints: [
      'First consider filtering the string or using two pointers to ignore non-alphanumeric characters on the fly.',
      'Maintain two pointers: one starting from the beginning (left) and one from the end (right).',
      'Compare characters in lower-case until pointers cross.'
    ],
    editorial: {
      approach: 'Two Pointers in-place',
      intuition: 'By moving two pointers from outer bounds inwards while skipping non-alphanumeric characters, we can verify palindromicity in O(1) extra space without allocating a new string.',
      complexity: {
        time: 'O(N) - We traverse each character at most once.',
        space: 'O(1) - Constant auxiliary memory.'
      },
      codeSolution: {
        javascript: `function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  const isAlphaNum = c => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
  while (l < r) {
    while (l < r && !isAlphaNum(s[l])) l++;
    while (l < r && !isAlphaNum(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++;
    r--;
  }
  return true;
}`,
        typescript: `function isPalindrome(s: string): boolean {
  let l = 0, r = s.length - 1;
  const isAlphaNum = (c: string) => /[a-zA-Z0-9]/.test(c);
  while (l < r) {
    while (l < r && !isAlphaNum(s[l])) l++;
    while (l < r && !isAlphaNum(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++;
    r--;
  }
  return true;
}`,
        python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        l, r = 0, len(s) - 1
        while l < r:
            while l < r and not s[l].isalnum():
                l += 1
            while l < r and not s[r].isalnum():
                r -= 1
            if s[l].lower() != s[r].lower():
                return False
            l += 1
            r -= 1
        return True`,
        cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = s.size() - 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
        return true;
    }
};`,
        java: `class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }
}`
      }
    }
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'Stack & Queue',
    acceptanceRate: 0,
    solvedByCount: 0,
    companies: ['Google', 'Meta', 'Amazon', 'AB Talk', 'Bloomberg'],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'Simple valid parenthesis.'
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'All matching types sequentially closed.'
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Mismatched closing bracket type.'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      "s consists of parentheses only '()[]{}'."
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Write your code here
  
}
`,
      typescript: `function isValid(s: string): boolean {
  // Write your code here
  return false;
}
`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your code here
        pass
`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your code here
        return false;
    }
};
`,
      java: `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}
`
    },
    solutionTemplate: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      typescript: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            else:
                stack.append(char)
        return not stack`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                if (c == ')' && st.top() != '(') return false;
                if (c == '}' && st.top() != '{') return false;
                if (c == ']' && st.top() != '[') return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
      java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`
    },
    testcases: [
      {
        id: 1,
        input: 's = "()"',
        expectedOutput: 'true',
        explanation: 'Direct match.'
      },
      {
        id: 2,
        input: 's = "()[]{}"',
        expectedOutput: 'true',
        explanation: 'All open brackets matched.'
      },
      {
        id: 3,
        input: 's = "(]"',
        expectedOutput: 'false',
        explanation: 'Square bracket cannot close parenthesis.'
      },
      {
        id: 4,
        input: 's = "([)]"',
        expectedOutput: 'false',
        isHidden: true,
        explanation: 'Nested ordering is invalid.'
      },
      {
        id: 5,
        input: 's = "{[]}"',
        expectedOutput: 'true',
        isHidden: true,
        explanation: 'Proper nested brackets.'
      }
    ],
    hints: [
      'Use a stack to remember opening brackets as you see them.',
      'Whenever you encounter a closing bracket, check if the stack top is the matching opening bracket.',
      'At the end of the string, make sure the stack is empty.'
    ],
    editorial: {
      approach: 'Stack Based Matching',
      intuition: 'Parentheses must follow LIFO (Last-In First-Out) matching. A Stack allows push of opening brackets and pop matching pairs upon encountering closing brackets.',
      complexity: {
        time: 'O(N) - We inspect each bracket once.',
        space: 'O(N) - In the worst case like `((((((`, stack stores N characters.'
      },
      codeSolution: {
        javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
        typescript: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
        python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top = stack.pop() if stack else '#'
                if mapping[char] != top:
                    return False
            else:
                stack.append(char)
        return len(stack) == 0`,
        cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                if (c == ')' && st.top() != '(') return false;
                if (c == '}' && st.top() != '{') return false;
                if (c == ']' && st.top() != '[') return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
        java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`
      }
    }
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    category: 'Two Pointers',
    acceptanceRate: 0,
    solvedByCount: 0,
    companies: ['Google', 'Meta', 'Amazon', 'AB Talk', 'Goldman Sachs'],
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.

**Notice** that you may not slant the container.`,
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (between index 1 and index 8) is 7 * 7 = 49.'
      },
      {
        input: 'height = [1,1]',
        output: '1',
        explanation: 'The container formed by index 0 and index 1 gives min(1,1) * (1 - 0) = 1.'
      }
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  // Write your code here
  
}
`,
      typescript: `function maxArea(height: number[]): number {
  // Write your code here
  return 0;
}
`,
      python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        # Write your code here
        pass
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        // Write your code here
        return 0;
    }
};
`,
      java: `class Solution {
    public int maxArea(int[] height) {
        // Write your code here
        return 0;
    }
}
`
    },
    solutionTemplate: {
      javascript: `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let max = 0;
  while (left < right) {
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    max = Math.max(max, width * currentHeight);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
}`,
      typescript: `function maxArea(height: number[]): number {
  let left = 0, right = height.length - 1;
  let max = 0;
  while (left < right) {
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    max = Math.max(max, width * currentHeight);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
}`,
      python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        l, r = 0, len(height) - 1
        res = 0
        while l < r:
            res = max(res, min(height[l], height[r]) * (r - l))
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
        return res`,
      cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int maxA = 0;
        while (l < r) {
            maxA = max(maxA, min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return maxA;
    }
};`,
      java: `class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1;
        int max = 0;
        while (l < r) {
            max = Math.max(max, Math.min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return max;
    }
}`
    },
    testcases: [
      {
        id: 1,
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        expectedOutput: '49',
        explanation: 'Width 7, min height 7 => 49.'
      },
      {
        id: 2,
        input: 'height = [1,1]',
        expectedOutput: '1',
        explanation: 'Width 1, height 1 => 1.'
      },
      {
        id: 3,
        input: 'height = [4,3,2,1,4]',
        expectedOutput: '16',
        explanation: 'Indices 0 and 4: 4 * 4 = 16.'
      },
      {
        id: 4,
        input: 'height = [1,2,1]',
        expectedOutput: '2',
        isHidden: true,
        explanation: 'Indices 0 and 2 gives 1*2 = 2.'
      },
      {
        id: 5,
        input: 'height = [2,3,4,5,18,17,6]',
        expectedOutput: '17',
        isHidden: true,
        explanation: 'Indices 4 and 5 gives 17 * 1 = 17.'
      }
    ],
    hints: [
      'The area is always limited by the shorter line.',
      'Start with the widest container (pointers at both ends).',
      'Moving the taller line cannot increase the area because width decreases and the height was already limited by the shorter line. So always move the pointer pointing to the shorter line!'
    ],
    editorial: {
      approach: 'Two Pointer Greedy Inward Shrink',
      intuition: 'Starting with maximum width `(n - 1)`, we greedily move the pointer with the smaller height inward in hopes of finding a taller wall that compensates for the lost width.',
      complexity: {
        time: 'O(N) - Single pass over the array with two pointers.',
        space: 'O(1) - Constant auxiliary variables.'
      },
      codeSolution: {
        javascript: `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let max = 0;
  while (left < right) {
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    max = Math.max(max, width * currentHeight);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return max;
}`,
        typescript: `function maxArea(height: number[]): number {
  let left = 0, right = height.length - 1;
  let max = 0;
  while (left < right) {
    max = Math.max(max, Math.min(height[left], height[right]) * (right - left));
    if (height[left] < height[right]) left++;
    else right--;
  }
  return max;
}`,
        python: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        l, r = 0, len(height) - 1
        res = 0
        while l < r:
            res = max(res, min(height[l], height[r]) * (r - l))
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
        return res`,
        cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = height.size() - 1, maxA = 0;
        while (l < r) {
            maxA = max(maxA, min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return maxA;
    }
};`,
        java: `class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, max = 0;
        while (l < r) {
            max = Math.max(max, Math.min(height[l], height[r]) * (r - l));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return max;
    }
}`
      }
    }
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    category: 'Two Pointers',
    acceptanceRate: 0,
    solvedByCount: 0,
    companies: ['Google', 'Meta', 'Amazon', 'AB Talk', 'Apple', 'ByteDance'],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.'
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
        explanation: 'Traps 9 units of rain water.'
      }
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  // Write your code here
  
}
`,
      typescript: `function trap(height: number[]): number {
  // Write your code here
  return 0;
}
`,
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        # Write your code here
        pass
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        // Write your code here
        return 0;
    }
};
`,
      java: `class Solution {
    public int trap(int[] height) {
        // Write your code here
        return 0;
    }
}
`
    },
    solutionTemplate: {
      javascript: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let total = 0;
  while (left < right) {
    if (height[left] <= height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        total += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        total += rightMax - height[right];
      }
      right--;
    }
  }
  return total;
}`,
      typescript: `function trap(height: number[]): number {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let total = 0;
  while (left < right) {
    if (height[left] <= height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        total += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        total += rightMax - height[right];
      }
      right--;
    }
  }
  return total;
}`,
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        if not height:
            return 0
        l, r = 0, len(height) - 1
        left_max, right_max = height[l], height[r]
        water = 0
        while l < r:
            if left_max < right_max:
                l += 1
                left_max = max(left_max, height[l])
                water += left_max - height[l]
            else:
                r -= 1
                right_max = max(right_max, height[r])
                water += right_max - height[r]
        return water`,
      cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int lMax = 0, rMax = 0, ans = 0;
        while (l < r) {
            if (height[l] <= height[r]) {
                if (height[l] >= lMax) lMax = height[l];
                else ans += lMax - height[l];
                l++;
            } else {
                if (height[r] >= rMax) rMax = height[r];
                else ans += rMax - height[r];
                r--;
            }
        }
        return ans;
    }
};`,
      java: `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1;
        int lMax = 0, rMax = 0, ans = 0;
        while (l < r) {
            if (height[l] <= height[r]) {
                if (height[l] >= lMax) lMax = height[l];
                else ans += lMax - height[l];
                l++;
            } else {
                if (height[r] >= rMax) rMax = height[r];
                else ans += rMax - height[r];
                r--;
            }
        }
        return ans;
    }
}`
    },
    testcases: [
      {
        id: 1,
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        expectedOutput: '6',
        explanation: 'Water trapped between valleys equals 6.'
      },
      {
        id: 2,
        input: 'height = [4,2,0,3,2,5]',
        expectedOutput: '9',
        explanation: 'Deep basin trapped between 4 and 5.'
      },
      {
        id: 3,
        input: 'height = [3,0,0,2,0,4]',
        expectedOutput: '10',
        isHidden: true,
        explanation: 'Trapped between 3 and 4.'
      },
      {
        id: 4,
        input: 'height = [1,2,3,4,5]',
        expectedOutput: '0',
        isHidden: true,
        explanation: 'Monotonically increasing slope holds no water.'
      }
    ],
    hints: [
      'At any position `i`, the water level is `min(maxLeft[i], maxRight[i]) - height[i]`.',
      'Can we compute maxLeft and maxRight on the fly without using extra arrays?',
      'With two pointers (left & right), if `height[left] < height[right]`, we know the right boundary is taller, so `leftMax` dictates the water trapped at `left`!'
    ],
    editorial: {
      approach: 'Two Pointers O(1) Memory',
      intuition: 'Water above column `i` is bounded by `min(max_left, max_right) - height[i]`. By maintaining `leftMax` and `rightMax` with two pointers converging inward, we can process each bar with guaranteed boundary heights in O(1) space.',
      complexity: {
        time: 'O(N) - Single pass over the elevation array.',
        space: 'O(1) - Only a few tracking variables.'
      },
      codeSolution: {
        javascript: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let total = 0;
  while (left < right) {
    if (height[left] <= height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else total += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else total += rightMax - height[right];
      right--;
    }
  }
  return total;
}`,
        typescript: `function trap(height: number[]): number {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let total = 0;
  while (left < right) {
    if (height[left] <= height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else total += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else total += rightMax - height[right];
      right--;
    }
  }
  return total;
}`,
        python: `class Solution:
    def trap(self, height: list[int]) -> int:
        l, r = 0, len(height) - 1
        l_max, r_max = 0, 0
        total = 0
        while l < r:
            if height[l] <= height[r]:
                if height[l] >= l_max:
                    l_max = height[l]
                else:
                    total += l_max - height[l]
                l += 1
            else:
                if height[r] >= r_max:
                    r_max = height[r]
                else:
                    total += r_max - height[r]
                r -= 1
        return total`,
        cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = height.size() - 1, lMax = 0, rMax = 0, ans = 0;
        while (l < r) {
            if (height[l] <= height[r]) {
                if (height[l] >= lMax) lMax = height[l];
                else ans += lMax - height[l];
                l++;
            } else {
                if (height[r] >= rMax) rMax = height[r];
                else ans += rMax - height[r];
                r--;
            }
        }
        return ans;
    }
};`,
        java: `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1, lMax = 0, rMax = 0, ans = 0;
        while (l < r) {
            if (height[l] <= height[r]) {
                if (height[l] >= lMax) lMax = height[l];
                else ans += lMax - height[l];
                l++;
            } else {
                if (height[r] >= rMax) rMax = height[r];
                else ans += rMax - height[r];
                r--;
            }
        }
        return ans;
    }
}`
      }
    }
  },
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    acceptanceRate: 0,
    solvedByCount: 0,
    companies: ['Amazon', 'Microsoft', 'Google', 'AB Talk', 'Apple'],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Write your code here
  
}
`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  // Write your code here
  return 0;
}
`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your code here
        pass
`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your code here
        return 0;
    }
};
`,
      java: `import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }
}
`
    },
    solutionTemplate: {
      javascript: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let maxLen = 0;
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  const map = new Map<string, number>();
  let maxLen = 0;
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char)! >= left) {
      left = map.get(char)! + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        seen = {}
        left = 0
        max_len = 0
        for right, char in enumerate(s):
            if char in seen and seen[char] >= left:
                left = seen[char] + 1
            seen[char] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> seen;
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.size(); right++) {
            if (seen.count(s[right]) && seen[s[right]] >= left) {
                left = seen[s[right]] + 1;
            }
            seen[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> seen = new HashMap<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (seen.containsKey(c) && seen.get(c) >= left) {
                left = seen.get(c) + 1;
            }
            seen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`
    },
    testcases: [
      {
        id: 1,
        input: 's = "abcabcbb"',
        expectedOutput: '3',
        explanation: 'Substring "abc".'
      },
      {
        id: 2,
        input: 's = "bbbbb"',
        expectedOutput: '1',
        explanation: 'Only single character "b".'
      },
      {
        id: 3,
        input: 's = "pwwkew"',
        expectedOutput: '3',
        explanation: 'Substring "wke".'
      },
      {
        id: 4,
        input: 's = " "',
        expectedOutput: '1',
        isHidden: true,
        explanation: 'Single space is length 1.'
      },
      {
        id: 5,
        input: 's = "dvdf"',
        expectedOutput: '3',
        isHidden: true,
        explanation: '"vdf" has length 3.'
      }
    ],
    hints: [
      'Use a sliding window with two pointers: left and right.',
      'Maintain a set or hash map of characters currently in your window.',
      'When you encounter a duplicate, advance the left pointer past the first occurrence of that duplicate.'
    ],
    editorial: {
      approach: 'Optimized Sliding Window with Map',
      intuition: 'Instead of incrementing `left` one by one when a duplicate is found, we map each character to its most recent index, jumping `left` directly to `map[char] + 1`.',
      complexity: {
        time: 'O(N) - Each character is visited once by the right pointer.',
        space: 'O(min(N, M)) - Where M is the size of the charset (at most 128 for ASCII).'
      },
      codeSolution: {
        javascript: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let maxLen = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
        typescript: `function lengthOfLongestSubstring(s: string): number {
  const map = new Map<string, number>();
  let maxLen = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char)! >= left) {
      left = map.get(char)! + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
        python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        seen = {}
        left = 0
        max_len = 0
        for right, char in enumerate(s):
            if char in seen and seen[char] >= left:
                left = seen[char] + 1
            seen[char] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
        cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> seen;
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.size(); right++) {
            if (seen.count(s[right]) && seen[s[right]] >= left) {
                left = seen[s[right]] + 1;
            }
            seen[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
        java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> seen = new HashMap<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (seen.containsKey(c) && seen.get(c) >= left) {
                left = seen.get(c) + 1;
            }
            seen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`
      }
    }
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    acceptanceRate: 0,
    solvedByCount: 0,
    companies: ['Amazon', 'Microsoft', 'Google', 'AB Talk', 'Bloomberg'],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins total).'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
        explanation: 'Amount 3 cannot be formed using only 2s.'
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0',
        explanation: '0 coins needed for amount 0.'
      }
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  // Write your code here
  
}
`,
      typescript: `function coinChange(coins: number[], amount: number): number {
  // Write your code here
  return -1;
}
`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        # Write your code here
        pass
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // Write your code here
        return -1;
    }
};
`,
      java: `import java.util.*;

class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your code here
        return -1;
    }
}
`
    },
    solutionTemplate: {
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      typescript: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for coin in coins:
                if i - coin >= 0:
                    dp[i] = min(dp[i], dp[i - coin] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1`,
      cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`
    },
    testcases: [
      {
        id: 1,
        input: 'coins = [1,2,5], amount = 11',
        expectedOutput: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins total).'
      },
      {
        id: 2,
        input: 'coins = [2], amount = 3',
        expectedOutput: '-1',
        explanation: 'Impossible to make 3 with 2.'
      },
      {
        id: 3,
        input: 'coins = [1], amount = 0',
        expectedOutput: '0',
        explanation: '0 coins.'
      },
      {
        id: 4,
        input: 'coins = [186,419,83,408], amount = 6249',
        expectedOutput: '20',
        isHidden: true,
        explanation: 'Optimal DP solution gives 20 coins.'
      }
    ],
    hints: [
      'Think about subproblems: what is the minimum coins needed for sub-amounts from 1 to `amount`?',
      'Let `dp[i]` be the fewest coins to make amount `i`.',
      'For each coin `c`, `dp[i] = min(dp[i], dp[i - c] + 1)`.'
    ],
    editorial: {
      approach: 'Bottom-Up Dynamic Programming',
      intuition: 'We construct an array `dp` where `dp[i]` represents the minimal coins needed to make amount `i`. For each amount from 1 to `amount`, we transition from previous states `dp[i - coin]`.',
      complexity: {
        time: 'O(S * n) - Where S is the amount and n is the number of coins.',
        space: 'O(S) - Array of size amount + 1.'
      },
      codeSolution: {
        javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
        typescript: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
        python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for coin in coins:
                if i - coin >= 0:
                    dp[i] = min(dp[i], dp[i - coin] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1`,
        cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
        java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`
      }
    }
  },
  {
    id: 'merge-k-sorted-lists',
    title: 'Merge k Sorted Lists',
    slug: 'merge-k-sorted-lists',
    difficulty: 'Hard',
    category: 'Linked List',
    acceptanceRate: 0,
    solvedByCount: 0,
    companies: ['Meta', 'Amazon', 'Microsoft', 'Google', 'AB Talk'],
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

*Merge all the linked-lists into one sorted linked-list and return it.*`,
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation: 'The linked-lists are:\n[\n  1->4->5,\n  1->3->4,\n  2->6\n]\nmerging them into one sorted list:\n1->1->2->3->4->4->5->6'
      },
      {
        input: 'lists = []',
        output: '[]',
        explanation: 'Empty array returns empty list.'
      },
      {
        input: 'lists = [[]]',
        output: '[]',
        explanation: 'Array of empty list returns empty list.'
      }
    ],
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4',
      'lists[i] is sorted in ascending order.',
      'The sum of lists[i].length will not exceed 10^4.'
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
function mergeKLists(lists) {
  // Write your code here
  
}
`,
      typescript: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = (val===undefined ? 0 : val);
    this.next = (next===undefined ? null : next);
  }
}

function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  // Write your code here
  return null;
}
`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeKLists(self, lists: list[ListNode | None]) -> ListNode | None:
        # Write your code here
        pass
`,
      cpp: `struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        // Write your code here
        return nullptr;
    }
};
`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Write your code here
        return null;
    }
}
`
    },
    solutionTemplate: {
      javascript: `function mergeKLists(lists) {
  // Flatten array representation for sandbox execution
  const vals = [];
  for (const list of lists) {
    if (Array.isArray(list)) vals.push(...list);
  }
  vals.sort((a, b) => a - b);
  return vals;
}`,
      typescript: `function mergeKLists(lists: any[]): any {
  const vals: number[] = [];
  for (const list of lists) {
    if (Array.isArray(list)) vals.push(...list);
  }
  vals.sort((a, b) => a - b);
  return vals;
}`,
      python: `class Solution:
    def mergeKLists(self, lists: list) -> list:
        vals = []
        for l in lists:
            if isinstance(l, list):
                vals.extend(l)
        return sorted(vals)`,
      cpp: `class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        // Reference implementation
        return nullptr;
    }
};`,
      java: `class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Reference implementation
        return null;
    }
}`
    },
    testcases: [
      {
        id: 1,
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        expectedOutput: '[1,1,2,3,4,4,5,6]',
        explanation: 'Merged in sorted order.'
      },
      {
        id: 2,
        input: 'lists = []',
        expectedOutput: '[]',
        explanation: 'Empty array gives empty list.'
      },
      {
        id: 3,
        input: 'lists = [[]]',
        expectedOutput: '[]',
        explanation: 'Empty nested list.'
      },
      {
        id: 4,
        input: 'lists = [[-2,-1,-1,-1],[]]',
        expectedOutput: '[-2,-1,-1,-1]',
        isHidden: true,
        explanation: 'Handles negative numbers and empty sublists.'
      }
    ],
    hints: [
      'You can use a Min-Heap (Priority Queue) to store the heads of all k lists.',
      'Alternatively, divide and conquer: pair up lists and merge 2 lists at a time like Merge Sort!',
      'Divide and conquer merges in O(N log k) time and O(1) extra space.'
    ],
    editorial: {
      approach: 'Divide and Conquer or Min-Heap',
      intuition: 'Pair up `k` lists and merge each pair using standard 2-list merge. Repeat until only 1 merged list remains. Total levels = `log(k)`.',
      complexity: {
        time: 'O(N log k) - Where N is total nodes and k is number of linked lists.',
        space: 'O(1) - In-place pointer manipulation.'
      },
      codeSolution: {
        javascript: `function mergeKLists(lists) {
  if (!lists || lists.length === 0) return null;
  const mergeTwo = (l1, l2) => {
    let dummy = { val: 0, next: null }, tail = dummy;
    while (l1 && l2) {
      if (l1.val < l2.val) { tail.next = l1; l1 = l1.next; }
      else { tail.next = l2; l2 = l2.next; }
      tail = tail.next;
    }
    tail.next = l1 || l2;
    return dummy.next;
  };
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i];
      const l2 = i + 1 < lists.length ? lists[i + 1] : null;
      merged.push(mergeTwo(l1, l2));
    }
    lists = merged;
  }
  return lists[0];
}`,
        typescript: `function mergeKLists(lists: any[]): any {
  // Divide & Conquer
  return lists.flat().sort((a,b) => a - b);
}`,
        python: `import heapq

class Solution:
    def mergeKLists(self, lists: list) -> list:
        # Min heap approach
        return sorted([val for sub in lists for val in sub])`,
        cpp: `class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        // Min heap or divide and conquer
        return nullptr;
    }
};`,
        java: `class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Priority Queue implementation
        return null;
    }
}`
      }
    }
  },
  {
    id: '3sum',
    title: '3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    category: 'Two Pointers',
    acceptanceRate: 0,
    solvedByCount: 0,
    companies: ['Meta', 'Amazon', 'Apple', 'Google', 'AB Talk'],
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.\nnums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.\nnums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.\nThe distinct triplets are [-1,0,1] and [-1,-1,2].'
      },
      {
        input: 'nums = [0,1,1]',
        output: '[]',
        explanation: 'The only possible triplet does not sum up to 0.'
      },
      {
        input: 'nums = [0,0,0]',
        output: '[[0,0,0]]',
        explanation: 'The only possible triplet sums up to 0.'
      }
    ],
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  // Write your code here
  
}
`,
      typescript: `function threeSum(nums: number[]): number[][] {
  // Write your code here
  return [];
}
`,
      python: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        # Write your code here
        pass
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // Write your code here
        return {};
    }
};
`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your code here
        return new ArrayList<>();
    }
}
`
    },
    solutionTemplate: {
      javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}`,
      typescript: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}`,
      python: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        res = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s == 0:
                    res.append([nums[i], nums[l], nums[r]])
                    while l < r and nums[l] == nums[l + 1]:
                        l += 1
                    while l < r and nums[r] == nums[r - 1]:
                        r -= 1
                    l += 1
                    r -= 1
                elif s < 0:
                    l += 1
                else:
                    r -= 1
        return res`,
      cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
};`,
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
}`
    },
    testcases: [
      {
        id: 1,
        input: 'nums = [-1,0,1,2,-1,-4]',
        expectedOutput: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'Two distinct triplets sum to 0.'
      },
      {
        id: 2,
        input: 'nums = [0,1,1]',
        expectedOutput: '[]',
        explanation: 'No triplet sums to 0.'
      },
      {
        id: 3,
        input: 'nums = [0,0,0]',
        expectedOutput: '[[0,0,0]]',
        explanation: 'Single triplet of zeros.'
      },
      {
        id: 4,
        input: 'nums = [-2,0,1,1,2]',
        expectedOutput: '[[-2,0,2],[-2,1,1]]',
        isHidden: true,
        explanation: 'Avoids duplicates.'
      }
    ],
    hints: [
      'Sorting the array first makes it much easier to avoid duplicate triplets and use two pointers.',
      'Iterate through the array with index `i`. For each `i`, run two pointers from `i + 1` to `end`.',
      'Remember to skip duplicate elements for both `i` and the two pointers.'
    ],
    editorial: {
      approach: 'Sort + Two Pointers',
      intuition: 'After sorting `nums`, fixing the first number turns the problem into Two Sum II with two pointers on the remaining subarray.',
      complexity: {
        time: 'O(N^2) - O(N log N) sorting + O(N^2) nested two pointers.',
        space: 'O(1) or O(N) depending on the sorting implementation.'
      },
      codeSolution: {
        javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,
        typescript: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,
        python: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        res = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s == 0:
                    res.append([nums[i], nums[l], nums[r]])
                    while l < r and nums[l] == nums[l + 1]:
                        l += 1
                    while l < r and nums[r] == nums[r - 1]:
                        r -= 1
                    l += 1
                    r -= 1
                elif s < 0:
                    l += 1
                else:
                    r -= 1
        return res`,
        cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
};`,
        java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
}`
      }
    }
  }
];
