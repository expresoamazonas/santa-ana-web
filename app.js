// ══════════════════════════════════════
// SANTA ANA S.R.L. - Aplicación
// Giros Nacionales
// ══════════════════════════════════════

// ══ MENÚ ══
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('navHamburger').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('navHamburger').classList.remove('open');
}

// ══ SPA ══
function showPage(id) {
  document.querySelectorAll('.spa-page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    a.style.color = a.dataset.page === id ? 'var(--verde)' : '';
  });
  setTimeout(() => {
    const b = document.getElementById('notifBanner');
    if (b && b.style.display !== 'none') {
      document.getElementById('page-' + id).style.paddingTop = b.offsetHeight + 'px';
    }
  }, 50);
}

// ══ SYSTEM PROMPT ══
const SYSTEM = `Eres el asistente virtual de Santa Ana Expreso Amazonas S.R.L., empresa boliviana especializada en giros de dinero nacionales, regulada por ASFI.

INFORMACIÓN:
- Nombre: Santa Ana Expreso Amazonas S.R.L.
- Servicios: Giros Nacionales
- +32 agencias a nivel nacional
- Dirección Central: Av. Héroes del Pacífico Nº 1374, Edificio Pacífico, La Paz, Bolivia
- Teléfono: 2228261 | Email: santaanasrlcontacto@gmail.com

GIROS NACIONALES:
- Monto: Desde Bs. 50 | Comisión: 1% (mín. Bs. 0.50) | Entrega: inmediata
- Horario: L-S 8:00–18:00 / Dom 9:00–13:00

PARA ENVIAR: CI vigente, nombre del destinatario, ciudad destino, monto
PARA COBRAR: CI vigente, código del giro


RECLAMOS: Plazo 5 días hábiles. Si no conforme, acudir a asfi.gob.bo
ALERTA FRAUDE: Un giro pagado NO tiene reembolso. Desconfíe de premios o urgencias por WhatsApp.

REGLAS:
- Responde en español boliviano, amable y conciso (máx. 4 oraciones)
- Nunca inventes información
- Si necesita agente: [DERIVAR_AGENTE]`;

let msgs = [], loading = false, chatOpen = false;

const quickOpts = ["¿Cómo envío un giro?","¿Cuánto cobran de comisión?","¿Dónde están las sucursales?","¿Qué documentos necesito?","¿Cuánto tarda en llegar?","Hablar con un agente"];

function toggleChat() {
  var wasOpen = chatOpen;
  chatOpen = !chatOpen;
  document.getElementById('chatFab').classList.toggle('open', chatOpen);
  document.getElementById('chatWindow').classList.toggle('open', chatOpen);
  document.getElementById('chatBadge').classList.add('hidden');
  if (chatOpen && !wasOpen && typeof registrarSesionChat === 'function') registrarSesionChat();
  if (chatOpen && msgs.length === 0) {
    setTimeout(() => {
      addMsg('bot', '¡Bienvenido/a a **Santa Ana Expreso Amazonas S.R.L.**! \n\nSoy tu asistente virtual. ¿En qué te puedo ayudar hoy?');
      renderQuick(true);
    }, 200);
  }
}

function addMsg(role, text) {
  msgs.push({ role, content: text });
  const box = document.getElementById('chatMsgs');
  const row = document.createElement('div');
  row.className = 'msg-row ' + role;
  const av = document.createElement('div');
  av.className = 'av ' + role;
  if (role === 'bot') {
    var avImg = document.createElement('img');
    avImg.src = 'logo.jpg';
    avImg.style.cssText = 'width:28px;height:28px;border-radius:50%;object-fit:cover';
    av.innerHTML = '';
    av.appendChild(avImg);
  } else {
    av.textContent = 'Tú';
  }
  const bub = document.createElement('div');
  bub.className = 'bubble ' + role;
  bub.innerHTML = fmt(text);
  row.appendChild(av); row.appendChild(bub);
  box.appendChild(row);
  box.scrollTop = box.scrollHeight;
}

function fmt(t) {
  return t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
          .replace(/\*(.*?)\*/g,'<span class="amt">$1</span>')
          .replace(/\n/g,'<br>');
}

function showTyping() {
  const box = document.getElementById('chatMsgs');
  const row = document.createElement('div');
  row.className = 'msg-row bot'; row.id = 'typing';
  const av = document.createElement('div'); av.className = 'av bot';
  var avImg2 = document.createElement('img'); avImg2.src = 'logo.jpg'; avImg2.style.cssText = 'width:28px;height:28px;border-radius:50%;object-fit:cover'; av.appendChild(avImg2);
  const bub = document.createElement('div'); bub.className = 'bubble bot';
  bub.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  row.appendChild(av); row.appendChild(bub);
  box.appendChild(row); box.scrollTop = box.scrollHeight;
}
function removeTyping() { const el = document.getElementById('typing'); if(el) el.remove(); }

function renderQuick(show) {
  const wrap = document.getElementById('chatQuick');
  wrap.innerHTML = '';
  if (!show) return;
  quickOpts.forEach(q => {
    const btn = document.createElement('button');
    btn.className = 'qbtn'; btn.textContent = q;
    btn.onclick = () => { document.getElementById('chatInput').value = q; handleSend(); };
    wrap.appendChild(btn);
  });
}

// Chatbot basado en reglas (preparado para integración futura con IA)
async function callClaude(userMsg) {
  return respuestaLocal(userMsg);
}
function respuestaLocal(msg){
  var m=msg.toLowerCase();
  if(m.indexOf('enviar')>-1||m.indexOf('mandar')>-1||m.indexOf('como envio')>-1||m.indexOf('quiero enviar')>-1)
    return '**Para enviar un giro:**\n\n1. Acércate a cualquier agencia con tu **CI vigente**\n2. Indica el nombre completo del destinatario\n3. Ciudad de destino y monto a enviar\n4. Paga el monto + comisión (1%)\n5. Recibe tu **código único** de giro\n\n¡Tu destinatario podrá cobrar al instante!';
  if(m.indexOf('cobrar')>-1||m.indexOf('recibir')>-1||m.indexOf('recoger')>-1||m.indexOf('como cobro')>-1)
    return '**Para cobrar un giro:**\n\n1. Ve a cualquier agencia de la ciudad destino\n2. Lleva tu **CI vigente** original\n3. Proporciona el **código del giro**\n4. Verifica: nombre del remitente, monto y fecha\n\n¡Cobras al instante!';
  if(m.indexOf('comision')>-1||m.indexOf('tarifa')>-1||m.indexOf('cuesta')>-1||m.indexOf('cobran')>-1||m.indexOf('precio')>-1||m.indexOf('cuanto')>-1)
    return '**Comisión: 1%** sobre el monto enviado (mínimo Bs. 0.50)\n\n• Bs. 50 - comisión Bs. 0.50 - total **Bs. 50.50**\n• Bs. 100 - comisión Bs. 1.00 - total **Bs. 101.00**\n• Bs. 300 - comisión Bs. 3.00 - total **Bs. 303.00**\n• Bs. 500 - comisión Bs. 5.00 - total **Bs. 505.00**\n• Bs. 1,000 - comisión Bs. 10.00 - total **Bs. 1,010.00**\n• Bs. 5,000 - comisión Bs. 50.00 - total **Bs. 5,050.00**\n\nMonto mínimo de envío: Bs. 50';
  if(m.indexOf('direccion')>-1||m.indexOf('ubicacion')>-1||m.indexOf('donde queda')>-1||m.indexOf('donde esta')>-1) {
    var ciudadesBO = ['la paz','cochabamba','santa cruz','oruro','potosi','sucre','tarija','trinidad','cobija','riberalta','guayaramerin','san borja','rurrenabaque','reyes','yucumo','caranavi','mapiri','apolo','ixiamas','san ignacio','magdalena','santa ana','ascencion','montero','warnes','quillacollo','sacaba','vinto','tiquipaya','el alto','viacha','achacachi','copacabana','desaguadero','tupiza','villazon','uyuni','camiri','yacuiba','bermejo'];
    var ciudadBuscada = '';
    var ciudadMencionada = '';
    if(sucursalesData.length > 0) {
      for(var i=0; i<sucursalesData.length; i++) {
        if(m.indexOf(sucursalesData[i].ciudad.toLowerCase()) > -1) {
          ciudadBuscada = sucursalesData[i].ciudad;
          break;
        }
      }
    }
    if(!ciudadBuscada) {
      for(var ci=0; ci<ciudadesBO.length; ci++) {
        if(m.indexOf(ciudadesBO[ci]) > -1) { ciudadMencionada = ciudadesBO[ci]; break; }
      }
    }
    if(ciudadBuscada) {
      var encontradas = sucursalesData.filter(function(s){ return s.ciudad.toLowerCase() === ciudadBuscada.toLowerCase(); });
      var resp = '**Sucursales en ' + ciudadBuscada + ':**\n\n';
      encontradas.forEach(function(s) {
        resp += '• ' + (s.depto ? s.depto + ' — ' : '') + s.dir;
        if(s.cerrada) resp += ' **(CERRADA' + (s.motivo ? ': ' + s.motivo : '') + ')**';
        resp += '\n';
      });
      resp += '\nHorario general: L-S 8:00–18:00 | Dom 9:00–13:00\nTel: **2228261**';
      return resp;
    }
    if(ciudadMencionada) {
      return 'Actualmente no contamos con una agencia en **' + ciudadMencionada.charAt(0).toUpperCase() + ciudadMencionada.slice(1) + '**.\n\nPuedes usar la agencia más cercana. Nuestras ciudades con sucursales son:\n\n' + (sucursalesData.length > 0 ? sucursalesData.map(function(s){return s.ciudad;}).filter(function(v,i,a){return a.indexOf(v)===i;}).join(', ') : 'La Paz, Cochabamba, Santa Cruz, Trinidad, Cobija, Riberalta y más') + '\n\nPara más info llama al **2228261**';
    }
    return '**Sede principal:**\nAv. Héroes del Pacífico Nº 1374, Edificio Pacífico, La Paz, Bolivia\n\nTel: **2228261**\nEmail: **santaanasrlcontacto@gmail.com**\n\nContamos con **' + (sucursalesData.length > 0 ? sucursalesData.length : '+32') + ' agencias** en Bolivia. Visita la sección **Sucursales** para ver todas.';
  }
  if(m.indexOf('sucursal')>-1||m.indexOf('agencia')>-1||m.indexOf('donde')>-1||m.indexOf('oficina')>-1||m.indexOf('ciudad')>-1) {
    var ciudadesBO2 = ['la paz','cochabamba','santa cruz','oruro','potosi','sucre','tarija','trinidad','cobija','riberalta','guayaramerin','san borja','rurrenabaque','reyes','yucumo','caranavi','mapiri','apolo','ixiamas','san ignacio','magdalena','santa ana','ascencion','montero','warnes','quillacollo','sacaba','vinto','tiquipaya','el alto','viacha','achacachi','copacabana','desaguadero','tupiza','villazon','uyuni','camiri','yacuiba','bermejo'];
    if(sucursalesData.length > 0) {
      var ciudadSuc = '';
      var ciudadNoEncontrada = '';
      for(var j=0; j<sucursalesData.length; j++) {
        if(m.indexOf(sucursalesData[j].ciudad.toLowerCase()) > -1) {
          ciudadSuc = sucursalesData[j].ciudad;
          break;
        }
      }
      if(!ciudadSuc) {
        for(var cj=0; cj<ciudadesBO2.length; cj++) {
          if(m.indexOf(ciudadesBO2[cj]) > -1) { ciudadNoEncontrada = ciudadesBO2[cj]; break; }
        }
      }
      if(ciudadSuc) {
        var sucs = sucursalesData.filter(function(s){ return s.ciudad.toLowerCase() === ciudadSuc.toLowerCase(); });
        var r = '**Sucursales en ' + ciudadSuc + ':**\n\n';
        sucs.forEach(function(s) {
          r += '• ' + (s.depto ? s.depto + ' — ' : '') + s.dir;
          if(s.cerrada) r += ' **(CERRADA' + (s.motivo ? ': ' + s.motivo : '') + ')**';
          r += '\n';
        });
        return r;
      }
      if(ciudadNoEncontrada) {
        var ciudadesDisp = [];
        sucursalesData.forEach(function(s){ if(ciudadesDisp.indexOf(s.ciudad)===-1) ciudadesDisp.push(s.ciudad); });
        return 'Actualmente no contamos con una agencia en **' + ciudadNoEncontrada.charAt(0).toUpperCase() + ciudadNoEncontrada.slice(1) + '**.\n\nNuestras sucursales están en:\n' + ciudadesDisp.join(', ') + '\n\nPara más info llama al **2228261**';
      }
      var ciudades = [];
      sucursalesData.forEach(function(s) {
        if(ciudades.indexOf(s.ciudad) === -1) ciudades.push(s.ciudad);
      });
      return '**' + sucursalesData.length + ' agencias en Bolivia:**\n\n' + ciudades.join(', ') + '\n\n**Sede principal:** Av. Héroes del Pacífico Nº 1374, Edificio Pacífico, La Paz\n\nVisita la sección **Sucursales** para ver la lista completa.';
    }
    return '**+32 agencias en Bolivia.**\n\n**Sede principal:** Av. Héroes del Pacífico Nº 1374, Edificio Pacífico, La Paz\n\nVisita la sección **Sucursales** para ver la lista completa.';
  }
  if(m.indexOf('horario')>-1||m.indexOf('hora')>-1||m.indexOf('atencion')>-1||m.indexOf('abierto')>-1)
    return '**Horario de atención:**\n\n• Lunes a Sábado: **8:00 – 18:00**\n• Domingos: **9:00 – 13:00**\n\nEl horario puede variar según la sucursal.';
  if(m.indexOf('requisito')>-1||m.indexOf('necesito')>-1||m.indexOf('documento')>-1||m.indexOf('ci')>-1||m.indexOf('carnet')>-1)
    return '**Requisitos:**\n\n**Para enviar:** CI vigente + nombre del destinatario + ciudad destino + monto\n**Para cobrar:** CI vigente + código del giro';
  if(m.indexOf('tarda')>-1||m.indexOf('demora')>-1||m.indexOf('tiempo')>-1||m.indexOf('rapido')>-1||m.indexOf('inmediato')>-1)
    return '¡La entrega es **inmediata**! Tu destinatario puede cobrar el giro en minutos desde que realizas el envío.';
  if(m.indexOf('reclamo')>-1||m.indexOf('queja')>-1||m.indexOf('problema')>-1)
    return '**Proceso de reclamo:**\n\n1. Acércate a cualquier agencia\n2. Presenta tu reclamo verbal o escrito\n3. Recibirás un número de constancia\n4. Plazo de respuesta: **5 días hábiles**\n\nSi no estás conforme, acude a **asfi.gob.bo**';
  if(m.indexOf('fraude')>-1||m.indexOf('estafa')>-1||m.indexOf('seguro')>-1||m.indexOf('seguridad')>-1)
    return '**Alerta de fraude:**\n\n• Nunca envíes dinero a personas que no conoces\n• Desconfía de premios o loterías\n• Un giro pagado **NO tiene reembolso**\n• Verifica siempre los datos antes de confirmar\n\nAnte dudas: **2228261**';
  if(m.indexOf('asfi')>-1||m.indexOf('regulad')>-1||m.indexOf('ley')>-1)
    return 'Santa Ana Expreso Amazonas S.R.L. opera bajo supervisión de **ASFI** (Ley Nº 393).\n\nTus derechos: acceso sin discriminación, información clara, derecho a reclamo.\n\nMás info: **asfi.gob.bo**';
  if(m.indexOf('contacto')>-1||m.indexOf('telefono')>-1||m.indexOf('llamar')>-1||m.indexOf('correo')>-1||m.indexOf('email')>-1)
    return '**Contacto:**\n\n• Teléfono: **2228261**\n• Email: **santaanasrlcontacto@gmail.com**\n• Sede: Av. Héroes del Pacífico Nº 1374, Edificio Pacífico, La Paz\n\n¡Estamos para ayudarte!';
  if(m.indexOf('hola')>-1||m.indexOf('buenos')>-1||m.indexOf('buenas')>-1||m.indexOf('saludos')>-1)
    return '¡Hola! Bienvenido/a a **Santa Ana Expreso Amazonas S.R.L.**\n\n¿En qué puedo ayudarte? Pregúntame sobre:\n• Cómo enviar o cobrar un giro\n• Tarifas y comisiones\n• Sucursales y horarios\n• Requisitos y documentos';
  if(m.indexOf('gracias')>-1||m.indexOf('agradec')>-1)
    return '¡De nada! Si tienes más preguntas no dudes en escribirme. ¡Que tengas un excelente día!';
  if(m.indexOf('agente')>-1||m.indexOf('persona')>-1||m.indexOf('humano')>-1)
    return 'Para hablar con un agente:\n\n• Llama al **2228261**\n• Escribe a **santaanasrlcontacto@gmail.com**\n• Visita nuestra sede en La Paz';
  if(m.indexOf('quien')>-1||m.indexOf('que es')>-1||m.indexOf('empresa')>-1||m.indexOf('santa ana')>-1)
    return '**Santa Ana Expreso Amazonas S.R.L.** es una empresa boliviana de Giros Nacionales, regulada por ASFI.\n\nCon más de **32 agencias** en todo Bolivia, conectamos familias de forma rápida y segura.';
  return 'Gracias por tu consulta. Puedo ayudarte con:\n\n• Cómo enviar o cobrar un giro\n• Tarifas y comisiones\n• Sucursales y horarios\n• Requisitos\n• Contacto\n\nO llama al **2228261** para atención personalizada.';
}

async function handleSend() {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const text = input.value.trim();
  if (!text || loading) return;
  if (typeof registrarMensaje === 'function') registrarMensaje(text);
  input.value = ''; input.style.height = 'auto';
  loading = true; sendBtn.disabled = true;
  renderQuick(false);
  addMsg('user', text);
  showTyping();
  try {
    const reply = await callClaude(text);
    removeTyping();
    if (reply.includes('[DERIVAR_AGENTE]')) {
      addMsg('bot', reply.replace('[DERIVAR_AGENTE]','').trim() || '¡Claro! Te conecto con un agente. ');
      document.getElementById('agentBanner').classList.add('visible');
    } else { addMsg('bot', reply); }
  } catch(e) {
    removeTyping();
    addMsg('bot', 'Ups, problema de conexión. Por favor intenta de nuevo. 🙏');
  }
  loading = false; sendBtn.disabled = false;
  // renderQuick(true); // FIX: no volver a mostrar los botones despues del primer mensaje
}

function connectAgent() {
  document.getElementById('agentBanner').classList.remove('visible');
  addMsg('bot', '✅ Te hemos conectado con un agente. En breve se comunicarán contigo. ¡Gracias por tu paciencia!');
}

document.getElementById('chatFab').addEventListener('click', toggleChat);

document.getElementById('chatInput').addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 80) + 'px';
});
document.getElementById('chatInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
});


// ══ FIREBASE + ADMIN ══
firebase.initializeApp({apiKey:"AIzaSyBOKNdtesydRvy2h74ZYfKUUEUmU_uSl2o",authDomain:"santa-ana-srl-224b5.firebaseapp.com",projectId:"santa-ana-srl-224b5",storageBucket:"santa-ana-srl-224b5.firebasestorage.app",messagingSenderId:"694113548685",appId:"1:694113548685:web:07d4ce833a327e906c65c4"});
var db=firebase.firestore();
var ADMIN_PASS='santa2026',isAdmin=false,sucursalesData=[];

function abrirLogin(){if(isAdmin){abrirAdmin();return;}document.getElementById('loginOverlay').classList.add('open');document.getElementById('loginPass').value='';document.getElementById('loginError').style.display='none';setTimeout(function(){document.getElementById('loginPass').focus();},100);}
function cerrarLogin(){document.getElementById('loginOverlay').classList.remove('open');}
function verificarAdmin(){var p=document.getElementById('loginPass').value;if(p===ADMIN_PASS){isAdmin=true;cerrarLogin();abrirAdmin();}else{document.getElementById('loginError').style.display='block';document.getElementById('loginPass').value='';}}
function abrirAdmin(){renderAdminList();cargarStats();document.getElementById('adminOverlay').classList.add('open');}
function cerrarAdmin(){document.getElementById('adminOverlay').classList.remove('open');}

document.getElementById('loginBtn').addEventListener('click',verificarAdmin);
document.getElementById('loginCancelBtn').addEventListener('click',cerrarLogin);
document.getElementById('adminCloseBtn').addEventListener('click',cerrarAdmin);
document.getElementById('addSucBtn').addEventListener('click',agregarSucursal);
document.getElementById('loginPass').addEventListener('keydown',function(e){if(e.key==='Enter')verificarAdmin();});

// ══ TABS ══
document.getElementById('tabSucBtn').addEventListener('click',function(){
  document.getElementById('tabSuc').style.display='block';document.getElementById('tabStats').style.display='none';
  document.getElementById('tabSucBtn').classList.add('active');document.getElementById('tabStatsBtn').classList.remove('active');
});
document.getElementById('tabStatsBtn').addEventListener('click',function(){
  document.getElementById('tabSuc').style.display='none';document.getElementById('tabStats').style.display='block';
  document.getElementById('tabStatsBtn').classList.add('active');document.getElementById('tabSucBtn').classList.remove('active');
  cargarStats();
});

// ══ SUCURSALES ══
function cargarSucursales(){db.collection('sucursales').orderBy('ciudad').onSnapshot(function(snap){sucursalesData=[];snap.forEach(function(doc){sucursalesData.push(Object.assign({id:doc.id},doc.data()));});renderSucPublic();if(isAdmin)renderAdminList();});}

function renderSucPublic(){var grid=document.querySelector('#page-sucursales .suc-grid');if(!grid||sucursalesData.length===0)return;grid.innerHTML='';sucursalesData.forEach(function(s){var card=document.createElement('div');card.className='suc-card'+(s.cerrada?' cerrada':'');var h='<div class="suc-dot"></div><div class="suc-c">'+s.ciudad+'</div><div class="suc-n">'+(s.depto?s.depto+' — ':'')+s.dir+'</div><div class="suc-h">'+(s.cerrada?'⛔ CERRADA':(s.horario||'L-S 8:00-18:00'))+'</div>';if(s.cerrada&&s.motivo)h+='<div class="suc-aviso">⚠️ '+s.motivo+'</div>';card.innerHTML=h;grid.appendChild(card);});}

function renderAdminList(){
  var l=document.getElementById('sucAdminList');document.getElementById('sucCount').textContent=sucursalesData.length;
  if(!sucursalesData.length){l.innerHTML='<div style="color:rgba(255,255,255,.3);font-size:13px;padding:12px">Sin sucursales.</div>';return;}
  l.innerHTML=sucursalesData.map(function(s){
    var badge=s.cerrada?'<span class="suc-status-badge cerrada-badge">⛔ Cerrada'+(s.motivo?' · '+s.motivo:'')+'</span>':'<span class="suc-status-badge abierta">✓ Abierta</span>';
    var cierreBtn=s.cerrada
      ?'<button class="suc-abrir-btn" onclick="abrirSuc(\''+s.id+'\')">✅ Abrir</button>'
      :'<button class="suc-cierre-btn" onclick="cerrarSuc(\''+s.id+'\')"> Cerrar</button>';
    return '<div class="suc-admin-row'+(s.cerrada?' cerrada':'')+'"><div class="suc-admin-info"><div class="suc-admin-ciudad">'+s.ciudad+'</div><div class="suc-admin-dir">'+(s.depto?s.depto+' — ':'')+s.dir+'</div></div>'+badge+cierreBtn+'<button class="suc-del-btn" onclick="eliminarSuc(\''+s.id+'\')">🗑</button></div>';
  }).join('');
}

function agregarSucursal(){var c=document.getElementById('newCiudad').value.trim(),d=document.getElementById('newDir').value.trim(),dp=document.getElementById('newDepto').value.trim(),h=document.getElementById('newHorario').value.trim()||'L-S 8:00-18:00';if(!c||!d){alert('Ciudad y dirección obligatorios');return;}mostrarGuardando();db.collection('sucursales').add({ciudad:c,dir:d,depto:dp,horario:h,cerrada:false,motivo:''}).then(function(){['newCiudad','newDir','newDepto','newHorario'].forEach(function(id){document.getElementById(id).value='';});ocultarGuardando();});}
function eliminarSuc(id){if(!confirm('¿Eliminar?'))return;mostrarGuardando();db.collection('sucursales').doc(id).delete().then(function(){ocultarGuardando();});}
function cerrarSuc(id){var motivo=prompt('Motivo del cierre temporal:');if(motivo===null)return;mostrarGuardando();db.collection('sucursales').doc(id).update({cerrada:true,motivo:motivo||'Cierre temporal'}).then(function(){ocultarGuardando();});}
function abrirSuc(id){mostrarGuardando();db.collection('sucursales').doc(id).update({cerrada:false,motivo:''}).then(function(){ocultarGuardando();});}
function mostrarGuardando(){document.getElementById('adminSaving').style.display='inline';}
function ocultarGuardando(){setTimeout(function(){document.getElementById('adminSaving').style.display='none';},500);}

// ══ ESTADÍSTICAS ══
function registrarVisita(){var ref=db.collection('stats').doc('general');ref.get().then(function(doc){if(doc.exists){ref.update({visitas:firebase.firestore.FieldValue.increment(1),ultimaVisita:new Date().toISOString()});}else{ref.set({visitas:1,sesionesChat:0,mensajes:0,ultimaVisita:new Date().toISOString()});}});}
function registrarSesionChat(){db.collection('stats').doc('general').set({sesionesChat:firebase.firestore.FieldValue.increment(1)},{merge:true});}
function registrarMensaje(texto){
  db.collection('stats').doc('general').set({mensajes:firebase.firestore.FieldValue.increment(1)},{merge:true});
  var ref=db.collection('stats').doc('faq');
  ref.get().then(function(doc){var faqs=doc.exists?doc.data():{};var key=texto.slice(0,50).toLowerCase();faqs[key]=(faqs[key]||0)+1;ref.set(faqs);});
  db.collection('chatlog').add({texto:texto,fecha:new Date().toISOString()});
}
function cargarStats(){
  db.collection('stats').doc('general').get().then(function(doc){
    var d=doc.exists?doc.data():{visitas:0,sesionesChat:0,mensajes:0};
    document.getElementById('stVisitas').textContent=d.visitas||0;
    document.getElementById('stSesiones').textContent=d.sesionesChat||0;
    document.getElementById('stMensajes').textContent=d.mensajes||0;
    document.getElementById('stSucursales').textContent=sucursalesData.length;
  });
  db.collection('stats').doc('faq').get().then(function(doc){
    var el=document.getElementById('faqList');
    if(!doc.exists){el.innerHTML='<div style="color:rgba(255,255,255,.3);font-size:12px">Sin datos aún</div>';return;}
    var data=doc.data();var sorted=Object.entries(data).sort(function(a,b){return b[1]-a[1];}).slice(0,8);var max=sorted[0]?sorted[0][1]:1;
    el.innerHTML=sorted.map(function(x){return '<div class="faq-row"><div class="faq-q">'+x[0]+'</div><div class="faq-bar-wrap"><div class="faq-bar" style="width:'+(x[1]/max*100)+'%"></div></div><div class="faq-n">'+x[1]+'</div></div>';}).join('');
  });
  db.collection('chatlog').orderBy('fecha','desc').limit(20).get().then(function(snap){
    var el=document.getElementById('chatLog');if(snap.empty){el.innerHTML='— Sin conversaciones —';return;}
    var html='';snap.forEach(function(doc){var d=doc.data();var f=d.fecha?new Date(d.fecha).toLocaleString('es-BO',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'';html+='<div style="padding:3px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span style="color:var(--acento2)">'+f+'</span> '+d.texto.slice(0,60)+(d.texto.length>60?'…':'')+'</div>';});
    el.innerHTML=html;
  });
}
document.getElementById('resetStatsBtn').addEventListener('click',function(){
  if(!confirm('¿Resetear estadísticas?'))return;
  db.collection('stats').doc('general').set({visitas:0,sesionesChat:0,mensajes:0});
  db.collection('stats').doc('faq').set({});
  db.collection('chatlog').get().then(function(snap){snap.forEach(function(doc){doc.ref.delete();});});
  cargarStats();
});

registrarVisita();
cargarSucursales();
if(window.location.search.indexOf('admin')>-1||window.location.hash.indexOf('admin')>-1){setTimeout(function(){abrirLogin();},600);}
