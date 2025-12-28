async function decryptContent(btn) {
    const wrapper = btn.closest('.password-wrapper');
    const encrypted = wrapper.dataset.encrypted;
    const password = wrapper.querySelector('.page-password').value;

    const [ivB64, dataB64] = encrypted.split(':');

    const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
    const data = Uint8Array.from(atob(dataB64), c => c.charCodeAt(0));

    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.digest(
        'SHA-256',
        enc.encode(password)
    );

    try {
        const key = await crypto.subtle.importKey(
            'raw',
            keyMaterial,
            { name: 'AES-CBC' },
            false,
            ['decrypt']
        );

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv },
            key,
            data
        );

        const html = new TextDecoder().decode(decrypted);

        wrapper.style.display = 'none';
        const target = wrapper.nextElementSibling;
        target.innerHTML = html;
        target.style.display = 'block';

    } catch (e) {
        wrapper.querySelector('.password-error').style.display = 'block';
    }
}
