const KEY='sharely_hackathon_v1';
let data=JSON.parse(localStorage.getItem(KEY)||'{}');
data.expenses=Array.isArray(data.expenses)?data.expenses:[];
data.goals=Array.isArray(data.goals)?data.goals:[];
data.recurringTemplates=Array.isArray(data.recurringTemplates)?data.recurringTemplates:[];
let authMode='login';

function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function money(n){return '₹'+Math.round(Number(n)||0).toLocaleString('en-IN')}
function escapeHTML(t){return String(t).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),2200)}

function showAuth(mode){
  closeInfo();
  authMode=mode;
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('auth').classList.remove('hidden');
  const signup=mode==='signup';
  document.getElementById('nameWrap')?.classList.toggle('hidden',!signup);
  document.getElementById('usernameWrap')?.classList.toggle('hidden',!signup);
  const authTitle=document.getElementById('authTitle');if(authTitle)authTitle.textContent=signup?'Create your Sharely account':'Welcome back';
  const authText=document.getElementById('authText');if(authText)authText.textContent=signup?'Create a local demo profile. Your data stays in this browser.':'Log in to your local Sharely workspace.';
  const authBtn=document.getElementById('authBtn');if(authBtn)authBtn.textContent=signup?'Create account':'Log in';
  const switchText=document.getElementById('switchText');if(switchText)switchText.textContent=signup?'Already have an account?':'New to Sharely?';
  const switchLink=document.querySelector('.switch .link');if(switchLink)switchLink.textContent=signup?'Log in':'Create an account';
}
function openInfo(tab){
  document.getElementById('infoOverlay').classList.remove('hidden');
  showInfoTab(tab||'why');
}
function closeInfo(){document.getElementById('infoOverlay')?.classList.add('hidden')}
function showInfoTab(tab){
  document.querySelectorAll('.info-tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===tab));
  document.querySelectorAll('.info-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===tab));
}
function toggleAuth(){showAuth(authMode==='login'?'signup':'login')}
function backHome(){document.getElementById('auth').classList.add('hidden');document.getElementById('landing').classList.remove('hidden')}
function authAction(){
  const email=document.getElementById('email').value.trim().toLowerCase();
  const pass=document.getElementById('password').value;
  const name=(document.getElementById('name').value.trim()||'Sharely User');
  const username=document.getElementById('username').value.trim().toLowerCase().replace(/\s+/g,'');
  if(!email||!email.includes('@')){toast('Please enter a valid email.');return}
  if(pass.length<6){toast('Password must be at least 6 characters.');return}
  if(authMode==='signup'){
    data.name=name;data.email=email;data.password=pass;
    if(username)data.username=username;
    save();toast('Account created successfully ✨');
  }else{
    if(data.email && (data.email!==email || data.password!==pass)){toast('Email or password does not match this browser profile.');return}
    data.email=email;data.password=pass;data.name=data.name||name;save();
  }
  openApp();
}
function demoLogin(){
  data.name='Alex';data.username='alexj';data.bio='Second-year CS student splitting a 2BHK with two flatmates.';data.email='demo@sharely.app';data.password='demo123';data.income=50000;data.other=12000;data.savings=10000;
  const fmt=d=>d.toLocaleDateString('en-IN');
  const daysAgo=n=>{const d=new Date();d.setDate(d.getDate()-n);return fmt(d)};
  if(!data.expenses.length)data.expenses=[
    {amount:11400,category:'Rent',desc:'Monthly rent',date:daysAgo(28)},
    {amount:3200,category:'Food',desc:'Groceries',date:daysAgo(25)},
    {amount:1800,category:'Transport',desc:'Commute',date:daysAgo(21)},
    {amount:1950,category:'Utilities',desc:'Electricity bill',date:daysAgo(17)},
    {amount:1250,category:'Shopping',desc:'Household items',date:daysAgo(11)},
    {amount:850,category:'Entertainment',desc:'Movie + snacks',date:daysAgo(6)},
    {amount:220,category:'Food',desc:'Coffee run',date:daysAgo(2)},
    {amount:180,category:'Food',desc:'Breakfast',date:daysAgo(1)},
    {amount:340,category:'Transport',desc:'Cab to campus',date:daysAgo(0)}
  ];
  if(!data.goals.length)data.goals=[{id:Date.now(),title:'New laptop',target:60000,saved:15000,date:'2026-12-01'}];
  save();openApp();toast('Demo workspace loaded 🚀');
}
function updateHeader(){
  const n=data.name||'Guest';
  document.getElementById('userName').textContent=n;
  document.getElementById('userHandle').textContent=data.username?'@'+data.username:'';
  renderAvatar();
}
function renderAvatar(){
  const n=data.name||'Guest',initial=n.charAt(0).toUpperCase();
  [document.getElementById('avatar'),document.getElementById('avatarLarge')].forEach(el=>{
    if(!el)return;
    el.innerHTML=data.avatar?`<img src="${data.avatar}" alt="Profile photo">`:initial;
  });
}
function handleAvatarUpload(event){
  const file=event.target.files&&event.target.files[0];if(!file)return;
  if(!file.type.startsWith('image/')){toast('Please choose an image file.');return}
  if(file.size>2*1024*1024){toast('Please choose an image under 2MB.');return}
  const reader=new FileReader();
  reader.onload=()=>{data.avatar=reader.result;save();renderAvatar();toast('Profile photo updated ✓')};
  reader.readAsDataURL(file);
}
function removeAvatar(){data.avatar='';save();renderAvatar();toast('Profile photo removed')}
function saveProfile(){
  const name=document.getElementById('profName').value.trim()||'Sharely User';
  const username=document.getElementById('profUsername').value.trim().toLowerCase().replace(/\s+/g,'');
  const bio=document.getElementById('profBio').value.trim();
  data.name=name;data.username=username;data.bio=bio;save();
  updateHeader();
  document.getElementById('welcome').textContent='Good to see you, '+name.split(' ')[0]+' 👋';
  toast('Profile saved ✓');
}
function dateKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function updateLoginStreak(){
  const todayKey=dateKey(new Date());
  if(data.lastVisitDate===todayKey)return;
  const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
  data.loginStreak=(data.lastVisitDate===dateKey(yesterday))?(data.loginStreak||0)+1:1;
  data.lastVisitDate=todayKey;
  save();
}
function expenseStreakInfo(){
  const days=new Set(data.expenses.map(e=>{const d=parseAppDate(e.date);return d?dateKey(d):null}).filter(Boolean));
  const today=new Date();
  const loggedToday=days.has(dateKey(today));
  const cursor=new Date(today);
  if(!loggedToday)cursor.setDate(cursor.getDate()-1);
  let streak=0;
  while(days.has(dateKey(cursor))){streak++;cursor.setDate(cursor.getDate()-1);}
  return {streak,loggedToday};
}
const STREAK_MILESTONES=[3,7,14,30,60,100];
function renderStreak(){
  const el=document.getElementById('streakCount');if(!el)return;
  const {streak,loggedToday}=expenseStreakInfo();
  data.longestStreak=Math.max(data.longestStreak||0,streak);
  data.milestonesReached=Array.isArray(data.milestonesReached)?data.milestonesReached:[];
  save();
  el.textContent=streak+'-day streak';
  const sub=document.getElementById('streakSub');
  if(streak===0)sub.textContent='Log an expense today to start your streak!';
  else if(loggedToday)sub.textContent='Logged today ✓ — keep it going tomorrow.';
  else sub.textContent='Add an expense today to keep your streak alive.';
  document.getElementById('streakFlame').classList.toggle('lit',streak>0);
  document.getElementById('streakBest').textContent='Best streak: '+data.longestStreak+(data.longestStreak===1?' day':' days');
  renderStreakWeek();
  renderStreakBadges();
}
function renderStreakWeek(){
  const el=document.getElementById('streakWeek');if(!el)return;
  const days=new Set(data.expenses.map(e=>{const d=parseAppDate(e.date);return d?dateKey(d):null}).filter(Boolean));
  const todayKey=dateKey(new Date());
  const cells=[];
  for(let i=6;i>=0;i--){
    const d=new Date();d.setDate(d.getDate()-i);
    const k=dateKey(d),logged=days.has(k),isToday=k===todayKey;
    const label=d.toLocaleDateString('en-IN',{weekday:'narrow'});
    const title=d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});
    cells.push(`<div class="week-cell${logged?' logged':''}${isToday?' is-today':''}" title="${title}"><span>${label}</span><i></i></div>`);
  }
  el.innerHTML=cells.join('');
}
function renderStreakBadges(){
  const el=document.getElementById('streakBadges');if(!el)return;
  const reached=data.milestonesReached||[];
  el.innerHTML=STREAK_MILESTONES.map(m=>`<span class="badge${reached.includes(m)?' earned':''}" title="${m}-day streak${reached.includes(m)?' — earned ✓':''}">${m}</span>`).join('');
}
function openApp(){
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('app').classList.add('show');
  const n=data.name||'Guest';
  document.getElementById('welcome').textContent='Good to see you, '+n.split(' ')[0]+' 👋';
  updateHeader();
  updateLoginStreak();
  loadSaved();
}
function logout(){document.getElementById('app').classList.remove('show');document.getElementById('landing').classList.remove('hidden');toast('Logged out.')}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open')}
function goById(id){const btn=[...document.querySelectorAll('.navbtn')].find(b=>b.getAttribute('onclick')?.includes("'"+id+"'"));go(id,btn)}
function go(id,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.navbtn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  document.getElementById('sidebar').classList.remove('open');
  if(id==='dashboard'||id==='analytics')updateDashboard();
  if(id==='expenses')renderExpenses();
  if(id==='roommates')generatePeople();
  if(id==='goals')renderGoals();
  if(id==='profile'){
    document.getElementById('profName').value=data.name||'';
    document.getElementById('profUsername').value=data.username||'';
    document.getElementById('profBio').value=data.bio||'';
    renderAvatar();
  }
}

function calculateRent(){
  const income=+document.getElementById('income').value||0,other=+document.getElementById('other').value||0,savings=+document.getElementById('saveGoal').value||0,ratio=+document.getElementById('ratio').value;
  if(income<=0){toast('Enter your monthly income first.');return}
  const limit=income*ratio/100,available=Math.max(0,income-other-savings),rec=Math.min(limit,available);
  document.getElementById('rentResult').textContent=money(rec);
  const s=document.getElementById('rentStatus'),a=document.getElementById('rentAdvice');
  if(rec<=0){s.textContent='Not affordable right now';s.style.color='var(--red)';a.textContent='Your other costs and savings goal use the amount currently available. Try a lower-cost option or revisit the plan.'}
  else if(rec<limit){s.textContent='Budget limited';s.style.color='var(--yellow)';a.textContent='Your percentage limit allows more, but your other costs and savings goal reduce the amount currently available.'}
  else{s.textContent='Fits your plan ✓';s.style.color='var(--green)';a.textContent='This estimate stays within your selected rent limit and your available monthly amount.'}
  data.income=income;data.other=other;data.savings=savings;save();updateDashboard();toast('Rent plan updated');
}
function fillRentExample(){document.getElementById('income').value=50000;document.getElementById('other').value=15000;document.getElementById('saveGoal').value=10000;calculateRent()}

function parseAppDate(str){
  if(!str)return null;
  const parts=str.split('/');
  if(parts.length!==3)return null;
  const d=+parts[0],m=+parts[1],y=+parts[2];
  if(!d||!m||!y)return null;
  return new Date(y,m-1,d);
}
function monthKey(date){return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')}
function monthTotal(offset){
  const now=new Date(),target=new Date(now.getFullYear(),now.getMonth()+offset,1),key=monthKey(target);
  return data.expenses.reduce((sum,e)=>{const d=parseAppDate(e.date);return sum+(d&&monthKey(d)===key?e.amount:0)},0);
}
function processRecurringExpenses(){
  if(!data.recurringTemplates.length)return;
  const key=monthKey(new Date());
  let added=false;
  data.recurringTemplates.forEach(t=>{
    const existsThisMonth=data.expenses.some(e=>e.templateId===t.id&&(()=>{const d=parseAppDate(e.date);return d&&monthKey(d)===key})());
    if(!existsThisMonth){
      data.expenses.unshift({amount:t.amount,category:t.category,desc:t.desc,date:new Date().toLocaleDateString('en-IN'),recurring:true,templateId:t.id});
      added=true;
    }
  });
  if(added)save();
}
function addExpense(){
  const amount=+document.getElementById('exAmount').value||0;
  if(amount<=0){toast('Enter a valid amount.');return}
  const category=document.getElementById('exCategory').value;
  const desc=document.getElementById('exDesc').value.trim()||'Expense';
  const recurring=document.getElementById('exRecurring').checked;
  const alreadyLoggedToday=data.expenses.some(e=>{const d=parseAppDate(e.date);return d&&dateKey(d)===dateKey(new Date())});
  const expense={amount,category,desc,date:new Date().toLocaleDateString('en-IN')};
  if(recurring){
    const templateId='t'+Date.now();
    expense.recurring=true;expense.templateId=templateId;
    data.recurringTemplates.push({id:templateId,amount,category,desc});
  }
  data.expenses.unshift(expense);
  save();
  document.getElementById('exAmount').value='';document.getElementById('exDesc').value='';document.getElementById('exRecurring').checked=false;
  renderExpenses();updateDashboard();
  if(!alreadyLoggedToday){
    const {streak}=expenseStreakInfo();
    data.longestStreak=Math.max(data.longestStreak||0,streak);
    data.milestonesReached=Array.isArray(data.milestonesReached)?data.milestonesReached:[];
    const hitMilestone=STREAK_MILESTONES.find(m=>streak===m&&!data.milestonesReached.includes(m));
    if(hitMilestone){data.milestonesReached.push(hitMilestone);save()}
    toast(hitMilestone?`🏆 ${hitMilestone}-day streak milestone!`:`🔥 ${streak}-day streak!`);
  }else{
    toast(recurring?'Recurring expense added ✓':'Expense added ✓');
  }
}
function stopRecurring(id){data.recurringTemplates=data.recurringTemplates.filter(t=>t.id!==id);save();renderRecurringList();toast('Stopped repeating')}
function renderRecurringList(){
  const el=document.getElementById('recurringList');if(!el)return;
  if(!data.recurringTemplates.length){el.innerHTML='';return}
  el.innerHTML='<small class="muted" style="display:block;margin-bottom:8px">Repeating monthly</small>'+
    data.recurringTemplates.map(t=>`<div class="item" style="padding:9px 12px;margin-bottom:6px"><span>🔁 ${escapeHTML(t.desc)} · ${money(t.amount)}</span><button class="delete" onclick="stopRecurring('${t.id}')" title="Stop repeating">×</button></div>`).join('');
}
function deleteExpense(i){data.expenses.splice(i,1);save();renderExpenses();updateDashboard();toast('Expense removed')}
function renderExpenses(){
  const total=data.expenses.reduce((a,e)=>a+e.amount,0);document.getElementById('expenseTotal').textContent=money(total);
  const list=document.getElementById('expenseList');
  const search=(document.getElementById('exSearch')?.value||'').toLowerCase().trim();
  const filterCat=document.getElementById('exFilterCategory')?.value||'';
  renderRecurringList();
  if(!data.expenses.length){
    list.innerHTML='<div class="empty">No expenses yet.<br>Add your first expense to start your analytics — or <button class="link" onclick="demoLogin()">try the demo</button>.</div>';
    return;
  }
  const filtered=data.expenses
    .map((e,i)=>({...e,_i:i}))
    .filter(e=>(!filterCat||e.category===filterCat)&&(!search||e.desc.toLowerCase().includes(search)||e.category.toLowerCase().includes(search)));
  if(!filtered.length){list.innerHTML='<div class="empty">No expenses match your search.</div>';return}
  list.innerHTML='';
  filtered.forEach(e=>list.innerHTML+=`<div class="item"><div><b>${escapeHTML(e.category)}</b><small>${escapeHTML(e.desc)} · ${escapeHTML(e.date)}${e.recurring?' · <span style="color:var(--cyan)">🔁 monthly</span>':''}</small></div><div><b>${money(e.amount)}</b> <button class="delete" onclick="deleteExpense(${e._i})">×</button></div></div>`);
}
function generatePeople(){
  const n=Math.max(1,Math.min(10,+document.getElementById('people').value||3)),c=document.getElementById('peopleInputs');c.innerHTML='';
  for(let i=1;i<=n;i++)c.innerHTML+=`<div class="field"><label>Person ${i}</label><input class="personName" value="Person ${i}"></div>`;
}
function splitRent(){
  const n=Math.max(1,Math.min(10,+document.getElementById('people').value||1));
  const total=(+document.getElementById('rrent').value||0)+(+document.getElementById('utilities').value||0)+(+document.getElementById('internet').value||0)+(+document.getElementById('groceries').value||0);
  const each=total/n;document.getElementById('houseTotal').textContent=money(total);
  const names=document.querySelectorAll('.personName'),r=document.getElementById('splitResults');r.innerHTML='';
  for(let i=0;i<n;i++)r.innerHTML+=`<div class="item"><div class="split"><span class="person-avatar">${(names[i]?.value||'P').charAt(0).toUpperCase()}</span><span>${escapeHTML(names[i]?.value||'Person '+(i+1))}</span></div><b>${money(each)}</b></div>`;
  toast('Fair split calculated ✓');
}

function addGoal(){
  const title=document.getElementById('goalTitle').value.trim()||'Goal';
  const target=+document.getElementById('goalTarget').value||0;
  let saved=+document.getElementById('goalSaved').value||0;
  const date=document.getElementById('goalDate').value;
  if(target<=0){toast('Enter a target amount.');return}
  if(saved<0)saved=0;
  if(saved>target)saved=target;
  data.goals.unshift({id:Date.now(),title,target,saved,date});
  save();
  document.getElementById('goalTitle').value='';document.getElementById('goalTarget').value='';document.getElementById('goalSaved').value='';document.getElementById('goalDate').value='';
  renderGoals();toast('Goal added ✓');
}
function addFundsToGoal(id){
  const input=document.getElementById('fund_'+id);const amount=+input.value||0;
  if(amount<=0){toast('Enter an amount to add.');return}
  const goal=data.goals.find(g=>g.id===id);if(!goal)return;
  const reached=goal.saved<goal.target&&goal.saved+amount>=goal.target;
  goal.saved=Math.min(goal.target,goal.saved+amount);
  save();renderGoals();
  toast(reached?`🎉 Goal reached: ${goal.title}!`:'Funds added ✓');
}
function deleteGoal(id){data.goals=data.goals.filter(g=>g.id!==id);save();renderGoals();toast('Goal removed')}
function monthsBetween(dateStr){
  if(!dateStr)return null;
  const target=new Date(dateStr),now=new Date();
  let months=(target.getFullYear()-now.getFullYear())*12+(target.getMonth()-now.getMonth());
  return Math.max(1,months);
}
function formatGoalDate(dateStr){
  if(!dateStr)return '';
  const d=new Date(dateStr);
  return d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
}
function renderGoals(){
  const list=document.getElementById('goalsList');
  if(list){
    document.getElementById('goalsCount').textContent=data.goals.length+(data.goals.length===1?' goal':' goals');
    if(!data.goals.length){list.innerHTML='<div class="empty">No purchase goals yet. Add one to start saving with a plan.</div>';}
    else{
      list.innerHTML='';
      data.goals.forEach(g=>{
        const pct=Math.round(Math.min(100,(g.saved/g.target)*100));
        const months=monthsBetween(g.date);
        const perMonth=months?Math.max(0,(g.target-g.saved)/months):null;
        list.innerHTML+=`<div class="item" style="flex-direction:column;align-items:stretch;gap:9px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div><b>${escapeHTML(g.title)}</b><small>${g.date?'By '+formatGoalDate(g.date):'No deadline set'}</small></div>
            <button class="delete" onclick="deleteGoal(${g.id})">×</button>
          </div>
          <div class="progress"><i style="width:${pct}%"></i></div>
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted)"><span>${money(g.saved)} saved</span><span>${money(g.target)} goal · ${pct}%</span></div>
          ${g.saved>=g.target?'<div class="tip" style="margin-top:0;color:var(--green)">🎉 Goal reached!</div>':(perMonth!=null?`<div class="tip" style="margin-top:0">Save ~${money(perMonth)}/month to reach this by ${formatGoalDate(g.date)}.</div>`:'')}
          ${g.saved<g.target?`<div class="goal-actions"><input type="number" min="0" id="fund_${g.id}" placeholder="Add amount"><button class="btn" onclick="addFundsToGoal(${g.id})">Add funds</button></div>`:''}
        </div>`;
      });
    }
  }
  renderGoalsSummary();
}
function renderGoalsSummary(){
  const el=document.getElementById('goalsSummary');if(!el)return;
  if(!data.goals.length){el.innerHTML='<div class="empty">No purchase goals yet. <button class="link" onclick="goById(\'goals\')">Set one now</button></div>';return}
  const totalTarget=data.goals.reduce((a,g)=>a+g.target,0),totalSaved=data.goals.reduce((a,g)=>a+Math.min(g.saved,g.target),0);
  const pct=totalTarget?Math.round(totalSaved/totalTarget*100):0;
  el.innerHTML=`<div class="item" style="flex-direction:column;align-items:stretch;gap:8px">
    <div style="display:flex;justify-content:space-between"><b>${data.goals.length} active ${data.goals.length===1?'goal':'goals'}</b><b>${pct}%</b></div>
    <div class="progress"><i style="width:${pct}%"></i></div>
    <small style="color:var(--muted)">${money(totalSaved)} saved of ${money(totalTarget)} total</small>
  </div>`;
}

function categoryTotals(){
  const m={};data.expenses.forEach(e=>m[e.category]=(m[e.category]||0)+e.amount);return m;
}
function healthScore(){
  const income=data.income||0,savings=data.savings||0,total=data.expenses.reduce((a,e)=>a+e.amount,0);
  if(!income)return 0;
  return Math.max(0,Math.min(100,Math.round(((income-total)/Math.max(income,1))*70+(Math.min(savings/income,.2)/.2)*30)));
}
function updateDashboard(){
  const income=data.income||0,savings=data.savings||0,total=data.expenses.reduce((a,e)=>a+e.amount,0),available=income-total-savings;
  document.getElementById('dIncome').textContent=money(income);document.getElementById('dExpenses').textContent=money(total);document.getElementById('dSavings').textContent=money(savings);document.getElementById('dAvailable').textContent=money(Math.max(0,available));
  document.getElementById('availableTrend').textContent=available>=0?'✓ On plan':'⚠ Over plan';
  document.getElementById('availableTrend').style.color=available>=0?'var(--green)':'var(--red)';
  const thisMonth=monthTotal(0),lastMonth=monthTotal(-1);
  const expenseTrendEl=document.getElementById('expenseTrend');
  if(lastMonth>0){
    const change=Math.round(((thisMonth-lastMonth)/lastMonth)*100);
    expenseTrendEl.textContent=(change>0?'↑ ':change<0?'↓ ':'→ ')+Math.abs(change)+'% vs last month';
    expenseTrendEl.style.color=change<=0?'var(--green)':'var(--red)';
  }else if(thisMonth>0){
    expenseTrendEl.textContent='No prior month to compare';expenseTrendEl.style.color='var(--muted)';
  }else{
    expenseTrendEl.textContent='No expenses tracked';expenseTrendEl.style.color='var(--muted)';
  }
  const score=healthScore();document.getElementById('healthValue').textContent=score+'%';
  document.getElementById('healthText').textContent=score>=70?'On track':score>=45?'Needs attention':'Review plan';
  document.getElementById('healthText').style.color=score>=70?'var(--green)':score>=45?'var(--yellow)':'var(--red)';
  document.getElementById('healthRing').style.background=`conic-gradient(${score>=70?'var(--green)':score>=45?'var(--yellow)':'var(--red)'} 0 ${score}%,#272240 ${score}% 100%)`;
  document.getElementById('healthAdvice').textContent=income?(available>=0?'Your tracked spending and savings goal currently fit within your income. Keep reviewing your biggest categories.':'Your tracked spending is above the available plan. Review the biggest categories in Analytics.'):'Add your income in Rent Planner to unlock your financial health score.';
  renderChart('dashChart');renderAnalytics();renderRecent();renderDonut('donut','legend');renderGoalsSummary();renderStreak();
}
function renderRecent(){
  const r=document.getElementById('recentList');r.innerHTML='';
  if(!data.expenses.length){r.innerHTML='<div class="empty">Your latest expenses will appear here. <button class="link" onclick="goById(\'expenses\')">Add one now</button></div>';return}
  data.expenses.slice(0,5).forEach(e=>r.innerHTML+=`<div class="item"><div><b>${escapeHTML(e.desc)}</b><small>${escapeHTML(e.category)} · ${escapeHTML(e.date)}</small></div><b>${money(e.amount)}</b></div>`);
}
function renderChart(id){
  const c=document.getElementById(id);c.innerHTML='';
  const vals=data.expenses.slice(0,14).reverse().map(e=>e.amount);const max=Math.max(...vals,1);
  if(!vals.length){c.innerHTML='<div class="empty" style="width:100%">Add expenses to build your graph.</div>';return}
  vals.forEach((v,i)=>{const b=document.createElement('div');b.className='bar';b.style.height=Math.max(7,v/max*220)+'px';b.title=money(v);b.style.animationDelay=(i*.04)+'s';c.appendChild(b)})
}
function renderDonut(donutId,legendId){
  const totals=categoryTotals(),entries=Object.entries(totals).sort((a,b)=>b[1]-a[1]);
  const total=entries.reduce((a,x)=>a+x[1],0);
  const colors=['#f04f9d','#8b5cf6','#ff9b5e','#43d9e8','#38d39f','#ffd166','#ff6f91','#60a5fa'];
  const donutEl=document.getElementById(donutId);
  if(total){
    let acc=0;
    donutEl.style.background=`conic-gradient(${entries.map((x,i)=>{const start=acc;acc+=x[1]/total*100;return `${colors[i%colors.length]} ${start}% ${acc}%`}).join(',')})`;
  }else{
    donutEl.style.background='var(--panel2)';
  }
  const l=document.getElementById(legendId);l.innerHTML='';
  entries.slice(0,6).forEach((x,i)=>l.innerHTML+=`<div><span><i class="dot" style="background:${colors[i%colors.length]}"></i>${escapeHTML(x[0])}</span><b>${Math.round(x[1]/Math.max(total,1)*100)}%</b></div>`);
  document.getElementById('donutTotal').textContent=money(total);
}
function renderAnalytics(){
  renderChart('trendChart');renderDonut('analyticsDonut','analyticsLegend');
  const totals=categoryTotals(),entries=Object.entries(totals).sort((a,b)=>b[1]-a[1]),total=data.expenses.reduce((a,e)=>a+e.amount,0);
  document.getElementById('analyticsTotal').textContent=money(total);
  document.getElementById('topCategory').textContent=entries[0]?entries[0][0]:'—';
  document.getElementById('avgExpense').textContent=money(data.expenses.length?total/data.expenses.length:0);
  document.getElementById('budgetRemaining').textContent=money(Math.max(0,(data.income||0)-total-(data.savings||0)));
}
function askAI(){
  const input=document.getElementById('aiInput'),q=input.value.trim();if(!q)return;
  const chat=document.getElementById('chat');chat.innerHTML+=`<div class="msg me">${escapeHTML(q)}</div>`;input.value='';chat.scrollTop=chat.scrollHeight;
  setTimeout(()=>{const m=document.createElement('div');m.className='msg bot';chat.appendChild(m);const text=advisor(q);let i=0;const timer=setInterval(()=>{m.textContent+=text[i++]||'';chat.scrollTop=chat.scrollHeight;if(i>=text.length)clearInterval(timer)},15)},350);
}
function advisor(q){
  const s=q.toLowerCase(),income=data.income||0,total=data.expenses.reduce((a,e)=>a+e.amount,0);
  if(s.includes('rent'))return 'For rent, consider the full monthly cost: rent + utilities + transport. Sharely’s Rent Planner can compare a rent limit with what remains after your other costs and savings goal.';
  if(s.includes('food'))return 'Try tracking food for a full week first. Then look at the category total in Analytics and choose one realistic change, such as planning grocery trips or reducing repeated small purchases.';
  if(s.includes('save'))return income?'Your current tracked income is '+money(income)+'. Set a savings target first, then use the remaining amount for flexible spending.':'Start by entering your income and savings goal in Rent Planner.';
  if(s.includes('expense')||s.includes('spend'))return total?'You have '+money(total)+' in tracked expenses. Open Analytics and check your biggest category before deciding what to reduce.':'Add a few expenses first so I can give more useful guidance.';
  if(s.includes('budget')||s.includes('income')||s.includes('salary'))return 'A simple starting framework is 50% needs, 30% wants and 20% savings, but it is only a guideline. Adjust it to your actual fixed costs and goals.';
  if(s.includes('goal')||s.includes('buy')||s.includes('purchase'))return data.goals.length?'You have '+data.goals.length+' purchase goal(s) set up. Open the Goals page to add funds or check how much to save each month.':'Head to the Purchase Goals page to set a target amount and date for something you want to buy — Sharely will estimate a monthly saving plan for it.';
  return 'I can help with rent, savings, food spending, budgeting, purchase goals and shared expenses. Try asking “Is my rent affordable?” or “How can I reduce my expenses?”';
}
function openGuide(title){
  const texts={
    '50 / 30 / 20':'A common starting framework is around 50% for needs, 30% for wants and 20% for savings. It is a guideline, not a rule—your actual fixed costs matter.',
    'Rent wisely':'Compare rent with your income, savings target, utilities and transport. A cheaper home that leaves room for goals can be easier to manage.',
    'Track first':'Record expenses consistently. Once you can see totals by category, you can choose changes based on evidence rather than guesses.',
    'Shared costs':'Agree on who shares which bills, calculate contributions clearly and keep a simple record of payments.',
    'Reduce waste':'Review recurring charges and repeated small purchases. Pick one or two realistic changes instead of trying to change everything at once.',
    'Monthly review':'At the end of each month, compare planned income/expenses with actual spending and make one practical adjustment for next month.'
  };
  document.getElementById('modalTitle').textContent=title;document.getElementById('modalText').textContent=texts[title]||'';document.getElementById('modal').classList.remove('hidden');
}
function closeModal(){document.getElementById('modal').classList.add('hidden')}
function exportData(){
  const summary={name:data.name||'Sharely User',username:data.username||'',bio:data.bio||'',income:data.income||0,savingsGoal:data.savings||0,expenses:data.expenses,goals:data.goals,recurringTemplates:data.recurringTemplates,totalExpenses:data.expenses.reduce((a,e)=>a+e.amount,0)};
  const blob=new Blob([JSON.stringify(summary,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sharely-summary.json';a.click();URL.revokeObjectURL(a.href);toast('Summary exported ✓');
}
function downloadReport(){
  const income=data.income||0,total=data.expenses.reduce((a,e)=>a+e.amount,0),savings=data.savings||0,available=income-total-savings;
  const entries=Object.entries(categoryTotals()).sort((a,b)=>b[1]-a[1]);
  const catHtml=entries.length?entries.map(([cat,amt])=>`<tr><td>${escapeHTML(cat)}</td><td>${money(amt)}</td></tr>`).join(''):'<tr><td colspan="2">No expenses recorded.</td></tr>';
  const goalsHtml=data.goals.length?data.goals.map(g=>`<tr><td>${escapeHTML(g.title)}</td><td>${money(g.saved)}</td><td>${money(g.target)}</td><td>${Math.round(Math.min(100,g.saved/g.target*100))}%</td></tr>`).join(''):'<tr><td colspan="4">No purchase goals set.</td></tr>';
  document.getElementById('printReport').innerHTML=`
    <h1>Sharely — Monthly Report</h1>
    <p>${escapeHTML(data.name||'Sharely User')}${data.username?' · @'+escapeHTML(data.username):''} · Generated ${new Date().toLocaleDateString('en-IN')}</p>
    <h2>Overview</h2>
    <table><tr><th>Income</th><td>${money(income)}</td></tr><tr><th>Expenses</th><td>${money(total)}</td></tr><tr><th>Savings goal</th><td>${money(savings)}</td></tr><tr><th>Available</th><td>${money(Math.max(0,available))}</td></tr><tr><th>Financial health score</th><td>${healthScore()}%</td></tr></table>
    <h2>Spending by category</h2>
    <table><tr><th>Category</th><th>Amount</th></tr>${catHtml}</table>
    <h2>Purchase goals</h2>
    <table><tr><th>Goal</th><th>Saved</th><th>Target</th><th>Progress</th></tr>${goalsHtml}</table>`;
  window.print();
}
function resetAllData(){
  if(!confirm('This permanently clears all Sharely data stored in this browser — profile, expenses, goals and settings. Continue?'))return;
  localStorage.removeItem(KEY);
  data={expenses:[],goals:[],recurringTemplates:[]};
  toast('All data cleared');
  logout();
}
function loadSaved(){
  if(data.income)document.getElementById('income').value=data.income;
  if(data.other)document.getElementById('other').value=data.other;
  if(data.savings)document.getElementById('saveGoal').value=data.savings;
  document.getElementById('profName').value=data.name||'';
  document.getElementById('profUsername').value=data.username||'';
  document.getElementById('profBio').value=data.bio||'';
  renderAvatar();
  processRecurringExpenses();
  renderExpenses();generatePeople();updateDashboard();renderGoals();
}

let onboardIndex=0,onboardTimer=null,onboardDragging=false,onboardStartX=0,onboardDeltaX=0;
function onboardSlideCount(){return document.querySelectorAll('#onboardTrack .onboard-slide').length}
function updateOnboardPosition(){
  const track=document.getElementById('onboardTrack');if(!track)return;
  track.style.transform=`translateX(-${onboardIndex*100}%)`;
  document.querySelectorAll('#onboardDots .dot-btn').forEach((d,i)=>d.classList.toggle('active',i===onboardIndex));
  document.querySelectorAll('#onboardTrack .onboard-slide').forEach((s,i)=>s.classList.toggle('active',i===onboardIndex));
}
function onboardGoTo(i){const n=onboardSlideCount();if(!n)return;onboardIndex=(i+n)%n;updateOnboardPosition();restartOnboardAutoplay()}
function onboardNext(){onboardGoTo(onboardIndex+1)}
function onboardPrev(){onboardGoTo(onboardIndex-1)}
function startOnboardAutoplay(){stopOnboardAutoplay();onboardTimer=setInterval(onboardNext,5500)}
function stopOnboardAutoplay(){if(onboardTimer)clearInterval(onboardTimer)}
function restartOnboardAutoplay(){stopOnboardAutoplay();startOnboardAutoplay()}
function initOnboard(){
  const track=document.getElementById('onboardTrack');if(!track)return;
  const slides=track.querySelectorAll('.onboard-slide'),dotsWrap=document.getElementById('onboardDots');
  if(!slides.length||!dotsWrap)return;
  dotsWrap.innerHTML='';
  slides.forEach((_,i)=>{
    const b=document.createElement('button');
    b.className='dot-btn'+(i===0?' active':'');
    b.setAttribute('aria-label','Go to slide '+(i+1));
    b.onclick=()=>onboardGoTo(i);
    dotsWrap.appendChild(b);
  });
  slides[0].classList.add('active');
  track.addEventListener('pointerdown',e=>{
    onboardDragging=true;onboardStartX=e.clientX;onboardDeltaX=0;
    track.style.transition='none';track.setPointerCapture(e.pointerId);stopOnboardAutoplay();
  });
  track.addEventListener('pointermove',e=>{
    if(!onboardDragging)return;
    onboardDeltaX=e.clientX-onboardStartX;
    track.style.transform=`translateX(calc(-${onboardIndex*100}% + ${onboardDeltaX}px))`;
  });
  const endDrag=()=>{
    if(!onboardDragging)return;
    onboardDragging=false;track.style.transition='';
    if(onboardDeltaX<-60)onboardNext();
    else if(onboardDeltaX>60)onboardPrev();
    else updateOnboardPosition();
    onboardDeltaX=0;startOnboardAutoplay();
  };
  track.addEventListener('pointerup',endDrag);
  track.addEventListener('pointercancel',endDrag);
  startOnboardAutoplay();
}
try{initOnboard()}catch(e){console.warn('Onboard carousel failed to initialize:',e)}
