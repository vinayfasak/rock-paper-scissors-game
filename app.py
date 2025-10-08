from flask import Flask, render_template, jsonify, request, session
import random

app = Flask(__name__)
# A secret key is required to use sessions
app.config['SECRET_KEY'] = 'your_super_secret_key'

@app.route('/')
def index():
    # Initialize the score in the session if it's not already there
    if 'score' not in session:
        session['score'] = {'player': 0, 'computer': 0, 'ties': 0}
    return render_template('index.html')

@app.route('/play', methods=['POST'])
def play():
    # Get the player's choice from the frontend
    player_choice = request.json['choice']
    
    # Define the possible choices and rules
    choices = ['rock', 'paper', 'scissors']
    computer_choice = random.choice(choices)
    
    # Determine the winner
    result = ''
    if player_choice == computer_choice:
        result = 'tie'
        session['score']['ties'] += 1
    elif (player_choice == 'rock' and computer_choice == 'scissors') or \
         (player_choice == 'scissors' and computer_choice == 'paper') or \
         (player_choice == 'paper' and computer_choice == 'rock'):
        result = 'win'
        session['score']['player'] += 1
    else:
        result = 'lose'
        session['score']['computer'] += 1
        
    # Make sure the session is saved
    session.modified = True
    
    # Return the game result and updated score as JSON
    return jsonify({
        'player_choice': player_choice,
        'computer_choice': computer_choice,
        'result': result,
        'score': session['score']
    })

@app.route('/reset', methods=['POST'])
def reset_score():
    # Reset the score in the session
    session['score'] = {'player': 0, 'computer': 0, 'ties': 0}
    session.modified = True
    return jsonify({'score': session['score']})

if __name__ == '__main__':
    app.run(debug=True)