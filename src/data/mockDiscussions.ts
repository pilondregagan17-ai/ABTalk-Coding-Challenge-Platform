import type { DiscussionPost } from '../types/index';

export const MOCK_DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'disc-1',
    problemId: 'two-sum',
    author: 'AlgoMaster_99',
    avatar: '👨‍💻',
    title: '🚀 Clean JavaScript & TypeScript O(N) Hash Map solution with clear visual intuition',
    content: `### Intuition
Instead of nested loops which take O(N^2) time, we can trade O(N) extra space using a Hash Map to achieve linear time complexity.

### Key Logic
As we iterate through \`nums\`, for each number \`x\`:
1. Calculate the complement: \`target - x\`
2. Check if the complement is already in our map.
3. If yes, return the stored index and current index.
4. Otherwise, register \`map[x] = currentIndex\`.

\`\`\`javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp), i];
    map.set(nums[i], i);
  }
  return [];
}
\`\`\`

### Complexity
- **Time**: \`O(N)\` - Single pass.
- **Space**: \`O(N)\` - Hash Map capacity.`,
    tags: ['JavaScript', 'Hash Table', 'Beginner Friendly'],
    createdAt: '2 hours ago',
    upvotes: 342,
    comments: [
      {
        id: 'comm-1',
        author: 'CodeNovice',
        avatar: '🌱',
        content: 'Great explanation! Clear and helped me understand the complement trick immediately.',
        createdAt: '1 hour ago',
        upvotes: 28
      },
      {
        id: 'comm-2',
        author: 'DevLead_San',
        avatar: '⚡',
        content: 'Clean code. Note that Map in JS preserves insertion order, though not strictly required here.',
        createdAt: '45 mins ago',
        upvotes: 14
      }
    ]
  },
  {
    id: 'disc-2',
    problemId: 'trapping-rain-water',
    author: 'ByteArchitect',
    avatar: '🛡️',
    title: '🧠 From O(N) space to O(1) space: The magic of Two Pointers converging',
    content: `### Deep Dive
Most people start with prefix max and suffix max arrays requiring O(N) memory. 
However, observe that for column \`i\`, the trapped water is determined by the **minimum** of maximums. 

If \`height[left] < height[right]\`, we know with 100% mathematical certainty that whatever lies between, the right side has a wall higher than or equal to \`height[left]\`. Hence \`leftMax\` is the strictly limiting factor!

\`\`\`python
class Solution:
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
        return total
\`\`\``,
    tags: ['Python', 'Two Pointers', 'Optimal Memory'],
    createdAt: '1 day ago',
    upvotes: 512,
    comments: [
      {
        id: 'comm-3',
        author: 'BinaryWizard',
        avatar: '🧙‍♂️',
        content: 'That proof of why we can safely move the smaller pointer is the best explanation I have seen anywhere.',
        createdAt: '18 hours ago',
        upvotes: 49
      }
    ]
  }
];
