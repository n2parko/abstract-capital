select date_trunc(date, week) as week, sum(amount) as weekly_spending
from prototype.transactions_view
where date >= '2020-07-31'
and amount > 0
group by 1
order by 1 