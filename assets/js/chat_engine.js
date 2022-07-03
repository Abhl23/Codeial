class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        // this will send the request for connection to the server side
        this.socket=io.connect('http://localhost:5000');

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){

        let self=this;

        this.socket.on('connect', function(){
            console.log('Connection established using sockets!');

            // emitting a join_room event to the server
            self.socket.emit('join_room', {
                user_email : self.userEmail,
                chatroom : 'codeial'
            });

            // detecting a user_joined event emitted in the chatroom
            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            });

        });

        // send a message on clicking the send button
        $('#send-message').click(function(){

            let msg=$('#chat-message-input').val();

            self.socket.emit('send_message', {
                message : msg,
                user_email : self.userEmail,
                chatroom : 'codeial'
            });
        });

        self.socket.on('receive_message', function(data){
            console.log('Message received!', data.message);

            let newMessage=$('<li>');

            let messageType='other-message';

            if(data.user_email == self.userEmail){
                messageType='self-message';
            }

            newMessage.append($('<span>', {
                html : data.message
            }));

            newMessage.append($('<sub>', {
                html : data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        });
    }
}