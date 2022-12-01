<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/', name: 'home')]
final class FrontController extends AbstractController
{
    public function __invoke()
    {
        return $this->render('home.html.twig');
    }

}