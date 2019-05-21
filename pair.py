import random

colors = ['R', 'O', 'Y', 'B', 'G', 'P']

selection = []
for i in range(4):
    selection.append(random.choice(colors))

# print(selection)

colors = {
    'P': '\033[35m',
    'B': '\033[94m',
    'G': '\033[92m',
    'Y': '\033[93m',
    'R': '\033[31m',
    'O': '\033[91m',
    'ENDC': '\033[0m'
}

def print_with_colors(guess):
    for c in guess:
        print(colors[c] + c + colors['ENDC'], end=' ')


def make_a_guess()

count = 0
while count < 10:
    guess = input(f'enter your guess ({count+1}/10):')
    if len(guess) != 4:
        print('Enter exactly four characters!')
        continue
    valid = True
    for char in guess:
        if char not in colors:
            print(f'{char} is not a color!')
            valid = False
    if not valid:
        continue

    count += 1

    print_with_colors(guess)


    print(" | ", end=' ')

    for i, char in enumerate(selection):
        if char == guess[i]:
            print('○', end=' ')
            guess[i] = '-'
        elif char in guess:
            print('●', end=' ')
    print('')

    if list(guess) == selection:
        print('you win!')
        break

if count == 10:
    print('you lose!')
    print_with_colors(''.join(selection))

