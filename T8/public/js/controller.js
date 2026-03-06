/*
 * controller.js
 *
 * CSC309 Tutorial 8
 * 
 * Complete me
 */
let nextparagraph = 1; 
let hasmore = true; 

function fetchParagraphs() {
    if (hasmore === false) {
        return;
    }

    fetch('/text?paragraph=' + nextparagraph, {
        method: 'GET',
        }
    ).then(res => res.json())
    .then(response => {
        for (let i = 0; i < response.data.length; i++) {
            const paragraph = response.data[i];
            const div = document.createElement('div');
            div.id = "paragraph_" + paragraph.id;  
            const p = document.createElement('p');
            p.textContent = paragraph.content;
            const b = document.createElement('b');
            b.textContent = "(Paragraph: " + paragraph.id + ")";
            p.appendChild(b);
            const btn = document.createElement('button');
            btn.addEventListener('click', function() {
                fetch('/text/like', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paragraph: paragraph.id })
                })
                .then(res => res.json())
                .then(data => {
                    btn.textContent = "Likes: " + data.data.likes;
                });
            });

            btn.classList.add('btn', 'like');
            btn.textContent = "Likes: " + paragraph.likes;

            p.appendChild(b);
            div.appendChild(p);
            div.appendChild(btn)
            document.getElementById('data').appendChild(div);
        }

        nextparagraph += 5;
        if (response.next === false) {
            hasmore = false;
            const div = document.createElement('div');
            
            const p = document.createElement('p');        
            const b = document.createElement('b');
            b.textContent = "You have reached the end"
            
            p.appendChild(b);
            div.appendChild(p);
            document.getElementById('data').appendChild(div);
        }
    });
}


window.addEventListener('scroll', function() {
    if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
        fetchParagraphs();
    }
});

fetchParagraphs();