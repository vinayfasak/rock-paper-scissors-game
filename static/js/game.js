$(document).ready(function() {
    
    function updateScore(score) {
        $('#player-score').text(score.player);
        $('#computer-score').text(score.computer);
        $('#tie-score').text(score.ties);
    }

    // Handle clicks on the new choice cards
    $('.choice-card').click(function() {
        const playerChoice = $(this).attr('id');
        
        // Visually select the player's card
        $('.choice-card').removeClass('selected');
        $(this).addClass('selected');

        // Send the choice to the backend
        $.ajax({
            url: '/play',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ choice: playerChoice }),
            success: function(response) {
                updateScore(response.score);

                // Add a small delay to make the computer's choice feel less instant
                setTimeout(function() {
                    // Highlight the computer's choice card
                    $('#' + response.computer_choice).addClass('selected');
                }, 300);

                let message = '';
                let resultClass = '';
                if (response.result === 'win') {
                    message = 'You Win!';
                    resultClass = 'win';
                } else if (response.result === 'lose') {
                    message = 'You Lose!';
                    resultClass = 'lose';
                } else {
                    message = "It's a Tie!";
                    resultClass = 'tie';
                }
                $('#result-message').text(message).removeClass('win lose tie').addClass(resultClass);
                $('#result-details').text(`You chose ${response.player_choice}, computer chose ${response.computer_choice}.`);
            }
        });
    });
    
    // Handle click on the reset button
    $('#reset-btn').click(function() {
        $.ajax({
            url: '/reset',
            type: 'POST',
            success: function(response) {
                updateScore(response.score);
                $('#result-message').text('').removeClass('win lose tie');
                $('#result-details').text('');
                $('.choice-card').removeClass('selected'); // Remove selection highlight
            }
        });
    });
});