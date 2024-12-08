# Advent of Code 2024

My definitely not optimized assortment of solutions to the 2024 Advent of Code challenges

## Completion status


|       | Part 1 | Part 2 |
|-------|--------|--------|
| Day 1 |    *   |    *   |
| Day 2 |    *   |        |
| Day 3 |    *   |    *   |
| Day 4 |    *   |    *   |
| Day 5 |    *   |    *   |


## Comments

If any!

### Day 2 

Part 2 had me scratching my head a bit, prob because of how I did my solution to part 1. Gonna move on for now.

### Day 4

Confused myself with the bit of the instructions that said "overlapping other words" and the example's first line showing "XXMAS", spent much longer than woulda been actually necessary 💀

Even though it was second try (minor logic error) I felt part 2 was easier, but that's probably because I over-complicated part 1 lol.

### Day 5

#### Part 1

Woulda had it first try but I rounded the middle number index calculation at the end instead of using `Math.floor`, oops.

#### Part 2

The whole time I was writing a solution for part 2, I was thinking "there's no way this will work" but it actually did! I went for an intentionally naive approach, my initial thinking was basically:
> "Finding each bad number and checking it's rules one by one sounds annoying, what if I did a sort of 'greedy' approach and just put the bad page at the very beginning, which would ensure it follows all of it's rules, then check if everything else is following the rules, and if not repeat that up to 1000 times."

I'm glad that worked though, if it didn't I woulda probably just came back to this one later. I'm also **positive** that my solution for both parts is probably really slow but optimization isn't my goal here 😎.
